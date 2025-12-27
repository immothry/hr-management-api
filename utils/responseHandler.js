
function success(res, data = {}, message = 'success') {
  return res.json({ status: 'success', message, ...data });
}

function error(res, statusCode = 400, message = 'error') {
  return res.status(statusCode).json({ status: 'error', message });
}

module.exports = { success, error };