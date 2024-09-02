document.addEventListener('DOMContentLoaded', () => { // Make sure the DOM is fully loaded before running this script.
  document.getElementById('greetButton').addEventListener('click', async () => {
    const name = document.getElementById('nameInput').value.trim() // Trim spaces.
    console.log('Button clicked')
    console.log(`Name entered: ${name}`)

    // Check if the variable 'name 'is empty.
    if (name === "") {
      alert("Please type your name in the text box before clicking the button.") // Display alert message.
      return // Cancel function if there is no input.
    }

    // Check if the name only contains latin letters.
    const validNamePattern = /^[A-Za-zÀ-ÖØ-öø-ÿ]+$/ // Regular expression to check for latin alphabet letters.
    if (!validNamePattern.test(name)) { // 'test' returns a Boolean value that indicates whether or not a pattern exists in a searched string.
      alert("The name must contain only letters from the Latin alphabet (no numbers or special characters).") // Display alert message.
      return // Cancel function if name is not correct.
    }

    try { // If a name exists and is correct:
      console.log('Attempting to fetch JSON')
      const response = await fetch('messages.json')
      if (!response.ok) {
        // Handle HTTP errors (like 404 or 500).
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      console.log('JSON fetched successfully')
      const data = await response.json()
      const messages = data.messages

      const messageElement = document.getElementById('message')
      let currentMessage = messageElement.textContent
      let randomMessage, output

      // Ensure that the new message is different from the currently displayed message to avoid repeated messages.
      do {
        randomMessage = messages[Math.floor(Math.random() * messages.length)]
        if (randomMessage.type === 'alien') {
          output = randomMessage.text.replace('[userName]', name)
        } else if (randomMessage.type === 'rovarsprak') {
          output = randomMessage.text.replace('[userName]', name).replace('[rovarsprak_name]', toRovarsprak(name))
        } else if (randomMessage.type === 'random') {
          output = randomMessage.text.replace('[userName]', name)
        }
      } while (output === currentMessage)

      // Remove all previous effect classes.
      messageElement.className = ''
      document.body.className = '' // Reset body class.
      const gifContainer = document.getElementById('gif-container')
      gifContainer.innerHTML = ''; // Clear any existing GIFs.

      // Set the appropriate class based on the message effect.
      if (randomMessage.effect) {
        messageElement.classList.add(randomMessage.effect)

        // Apply background class to the body.
        if (randomMessage.effect === 'ufo') {
          document.body.classList.add('ufo-background')
        } else if (randomMessage.effect === 'bounce') {
          document.body.classList.add('rovarsprak-background')
        } else if (randomMessage.effect === 'glow') {
          document.body.classList.add('random-gradient-background') // Apply gradient background.
          // Create an img element for the GIF.
          const gif = document.createElement('img')
          gif.src = 'https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExdnlpNDUyYmdobDBna2oyZ3JlZjR2aWZhYXhoNXJ0NXIzMmUyYmFmMCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/tooHQBkRJWSspcdZzj/giphy.webp'
          gif.className = 'slide-up-gif'
          gifContainer.appendChild(gif)
        }
      }

      // Set the text content.
      messageElement.textContent = output
      messageElement.style.display = 'block' // Ensure it's visible.

      console.log(`Message displayed: ${output}`)

    } catch (error) {
      console.error('Error fetching JSON:', error)
      document.getElementById('message').textContent = 'Could not load messages. Try again later.'
    }
  })
})

function toRovarsprak(name) {
  // Convert the entire string to lowercase.
  let rovarsprakName = name.toLowerCase()

  // Checks for all the consonants (case-insensitive) in a string.
  // Adds consonant + 'o' + consonant in the string.
  rovarsprakName = rovarsprakName.replace(/([bcdfghjklmnpqrstvwxz])/gi, '$1o$1')

  // Convert the first letter in the string to uppercase.
  return rovarsprakName.charAt(0).toUpperCase() + rovarsprakName.slice(1)
}