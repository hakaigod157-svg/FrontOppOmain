const fetchdroits = async (nameTable) => {
  const lstDroit = localStorage.getItem('listeDroits');
  if (lstDroit) {
    const droits = JSON.parse(lstDroit);
    const element = await droits.find((item) => item.descAcces.trim() === nameTable.trim());
    if (element) {
      return element.write === 1 ? true : false;
    } else {
      return false;
    }
  } else {
    return false;
  }
};

export { fetchdroits };