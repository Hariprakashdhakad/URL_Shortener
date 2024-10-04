module.exports = (userAgent) => {
    if (/mobile/i.test(userAgent)) return 'mobile';
    return 'desktop';
  };
  