
function requireFields(obj, fields = []) {
  const missing = [];
  for (const f of fields) {
    if (obj[f] === undefined || obj[f] === null || obj[f] === '') missing.push(f);
  }
  return missing;
}

function isValidMonthYear(month, year) {
  const m = Number(month);
  const y = Number(year);
  if (!Number.isInteger(m) || m < 1 || m > 12) return false;
  if (!Number.isInteger(y) || y < 1970) return false;
  return true;
}

module.exports = { requireFields, isValidMonthYear };