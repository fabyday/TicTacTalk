
export function convertPath(pth: string) {
  if (process.platform === "win32") {
    return pth;
  } else {
    // darwin, linux ... unix like OS
    return "file://" + pth;
  }
}
