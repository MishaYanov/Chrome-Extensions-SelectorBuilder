export function copyToClipboard(finishedSelector: string): void {
  navigator.clipboard.writeText(finishedSelector).then(
    function () {
      console.log("Text copied to clipboard.");
      //TODO: Add a notification that the text was copied to the clipboard and remove console log
    },
    function (err) {
      console.error("Failed to copy text: ", err);
      //TODO: Add a notification that the text was not copied to the clipboard and remove console log
    }
  );
}
