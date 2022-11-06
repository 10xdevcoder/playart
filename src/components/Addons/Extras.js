export const loadExternalURL = (url) => {
  window.open(url, "_blank");
};

export const copyToClipboard = async (value) => {
  try {
    await navigator.clipboard.writeText(value);
  } catch (error) {
    console.log(error);
  }
};

export const shortenText = (str, n1 = 6, n2 = 4) => {
  if (str) {
    return `${str.slice(0, n1)}...${str.slice(str.length - n2)}`;
  }
  return "";
};

export function die(message) {
  console.error(message);
  process.exit(1);
}

function padTo2Digits(num) {
  if (num > 9) {
    return num.toString().padStart(2, "0");
  } else if (num < 10) {
    return num.toString().padStart(1, "0");
  }
}

export function convertMsToTime(milliseconds) {
  let seconds = Math.floor(milliseconds / 1000);
  let minutes = Math.floor(seconds / 60);

  seconds = seconds % 60;

  // 👇️ If you don't want to roll hours over, e.g. 24 to 00
  // 👇️ comment (or remove) the line below
  // commenting next line gets you `24:00:00` instead of `00:00:00`
  // or `36:15:31` instead of `12:15:31`, etc.
  // hours = hours % 24;

  return `${padTo2Digits(minutes)}`;
}
