const Url = require('../models/Url');
const Visit = require('../models/Visit');
const generateShortCode = require('../utils/generateShortCode');
const getDeviceType = require('../utils/deviceType'); 
const crypto = require('crypto');


exports.shortenUrl = async (req, res) => {
  const { originalUrl, customCode, expiresAt } = req.body;
  const shortCode = customCode || generateShortCode();

  try {
    // Check for custom code uniqueness
    if (customCode) {
      const existingUrl = await Url.findOne({ shortCode });
      if (existingUrl) {
        return res.status(400).json({ error: 'Custom short code already in use' });
      }
    }

    const newUrl = await Url.create({ originalUrl, shortCode, expiresAt });
    res.status(201).json({ shortCode: newUrl.shortCode });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error creating short URL' });
  }
};

exports.redirectUrl = async (req, res) => {
    try {
        const shortCode = req.params.shortCode; 
        const url = await Url.findOne({ shortCode });

        if (!url) {
            return res.status(404).json({ message: 'URL not found' });
        }

        
        if (url.expiresAt && new Date(url.expiresAt) < new Date()) {
            return res.status(410).json({ message: 'This URL has expired.' });
        }

        
        url.totalVisits += 1;

        
        const ipHash = crypto.createHash('sha256').update(req.ip).digest('hex');
        if (!url.uniqueVisitors.includes(ipHash)) {
            url.uniqueVisitors.push(ipHash);
        }

       
        const userAgent = req.headers['user-agent'];
        const deviceType = getDeviceType(userAgent);

        
        const existingDevice = url.deviceTypeBreakdown.find(d => d.device === deviceType);
        if (existingDevice) {
            existingDevice.count++;
        } else {
            url.deviceTypeBreakdown.push({ device: deviceType, count: 1 });
        }

        // Update time series data
        const today = new Date().toISOString().split('T')[0]; 
        const existingDateEntry = url.timeSeriesData.find(entry => entry._id === today);
        if (existingDateEntry) {
            existingDateEntry.count++;
        } else {
            url.timeSeriesData.push({ _id: today, count: 1 });
        }

        // Create a new visit entry
        const visit = new Visit({
            url: url._id,
            userAgent: userAgent,
            ip: req.ip,
            referrer: req.headers.referer || 'Direct',
            deviceType: deviceType
        });

        await visit.save(); 
        await url.save(); 

        
        return res.redirect(302, url.originalUrl);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

// Get analytics
exports.getAnalytics = async (req, res) => {
    const { shortCode } = req.params;
    const url = await Url.findOne({ shortCode });
  
    if (!url) return res.status(404).json({ error: 'Short URL not found' });
  
    const visits = await Visit.find({ url: url._id });
    
    
    const deviceTypeBreakdown = visits.reduce((acc, visit) => {
      acc[visit.deviceType] = (acc[visit.deviceType] || 0) + 1;
      return acc;
    }, {});
  
    const pieChartData = Object.entries(deviceTypeBreakdown).map(([device, count]) => ({
      device,
      count,
    }));
  
   
    const timeSeriesData = await Visit.aggregate([
      { $match: { url: url._id } },
      { $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$timestamp" } },
        count: { $sum: 1 }
      }},
      { $sort: { _id: 1 } } 
    ]);
  
    res.json({
      originalUrl: url.originalUrl,
      totalVisits: url.visitCount,
      uniqueVisitors: url.uniqueVisitors.size,
      deviceTypeBreakdown: pieChartData, 
      timeSeriesData
    });
  };
  