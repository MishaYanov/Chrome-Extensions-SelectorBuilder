export function copyToClipboard(finishedSelector: string): void {
  navigator.clipboard.writeText(finishedSelector).then(
    function () {
      console.log("Text copied to clipboard.");
    },
    function (err) {
      console.error("Failed to copy text: ", err);
    }
  );
}
