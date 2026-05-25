const toNumber = (s:string) => Number(s.replace(/[^0-9.-]/g, ''));
toNumber("$123.45");