export const generateUrlWithParams = (url: string, params: any) => {
  for (const key in params) {
    if (key === "pagination") {
      for (const pagination in params[key]) {
        if (url.slice(-1) === "?") {
          url += `${pagination}=${params[key][pagination]}`;
        } else {
          url += `&${pagination}=${params[key][pagination]}`;
        }
      }
    } else {
      if (url.slice(-1) === "?") {
        url += `${key}=${params[key]}`;
      } else {
        url += `&${key}=${params[key]}`;
      }
    }
  }

  return url;
};
