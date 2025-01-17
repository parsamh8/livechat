function countWords(text) {
    // Remove all non-alphanumeric characters (spaces, dots) and split the text into words
    let cleanedText = text.replace(/[.]/g, '').trim();
    let words = cleanedText.split(/\s+/); // Split by one or more spaces
    
    return words.length;
  }
  
  // Example usage
  let text = "Pellentesque lorem dolor, malesuada eget tortor vitae, tristique lacinia lectus. Pellentesque sed accumsan risus.";
  console.log(countWords(text));