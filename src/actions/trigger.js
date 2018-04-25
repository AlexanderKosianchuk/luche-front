export default function trigger(payload, args) {
  args = Array.isArray(args) ? args : [];
  return function(dispatch) {
    // DO NOT POPULATE
    $(document).trigger(payload, args);
  }
};
