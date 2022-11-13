export const getPayloadJwt = (jwt = "") => {
  jwt = jwt.toString().split(".")[1];
  const payload = JSON.parse(window.atob(jwt));
  payload.exp = new Date(new Date().setTime(payload.exp * 1000));
  return payload;
};

export const checkJwtInCookies = () => {
  return document.cookie.match(
    /(?:(?:^|.*;\s*)XSRF-TOKEN\s*\=\s*([^;]*).*$)|^.*$/
  )[1];
};
