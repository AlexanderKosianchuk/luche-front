export default function objectToFormData(obj) {
  let formData = new FormData();

  function appendFormData(data, root) {
    root = root || '';
    if (data instanceof File) {
      formData.append(root, data);
    } else if (Array.isArray(data)) {
      for (var i = 0; i < data.length; i++) {
        appendFormData(data[i], root + '[' + i + ']');
      }
    } else if (typeof data === 'object' && data) {
        Object.keys(data).forEach((key) => {
          if (data.hasOwnProperty(key)) {
            if (root === '') {
              appendFormData(data[key], key);
            } else {
              appendFormData(data[key], root + '.' + key);
            }
          }
        });
    } else {
      if (data !== null && typeof data !== 'undefined') {
        formData.append(root, data);
      }
    }
  }

  appendFormData(obj);

  return formData;
}
