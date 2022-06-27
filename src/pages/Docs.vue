<template>
<div class="w-fit px-2 pb-5 m-auto overflow-x-scroll">
  <section>
    <h1 class="h1">Documentation</h1>
    <p>Learn how to integrate Simple Form Backend to your website.</p>
    <p>If you still need help after reading the documents, please feel free to <router-link to="/contact?reason=help" class="link">contact us</router-link> for support.</p>
  </section>
  <section>
    <h2 class="h2">What You Need</h2>
    <p>You need 2 things ready before you start to write code.</p>
    <ul class="list-disc list-inside	">
      <li>
        Your Project ID
      </li>
      <li>
        A Topic String
      </li>
    </ul>
    <h3 class="h3">Project ID</h3>
    <p>You can get your Project Id <router-link to="/account" class="link">here</router-link> if you have already signed in.</p>
    <h3 class="h3">Topic String</h3>
    <p>You need to come up with a short string to identify your form. Ideally it has less than 10 characters but it won't hurt to go slightly over.</p>
    <p>This topic string can really be anything. We strongly suggest you to have a unique topic string for each of your different forms.</p>
    <p>If you can't come up with anything, we recommand you to choose from any of these:</p>
    <ul class="list-disc list-inside	">
      <li>Contact</li>
      <li>Help</li>
      <li>Enquiry</li>
    </ul>
  </section>
	<section>
		<h2 class="h2">The Basics With Pure HTML</h2>
		<pre class="code"><code>{{
`<form action="https://sfb.sengstech.com/api/submit/YOUR_PROJECT_ID/TOPIC_STRING" method="POST">
	<label for="email">Your email</label>
	<input type="email" name="email">

	<label for="name">Your name</label>
	<input type="text" name="name">

	<label for="message">Your Message</label>
	<textarea name="message"></textarea>

	<button type="submit">Submit</button>
</form>`}}</code></pre>
    <p>You can put these lines on the contact page of your website.</p>
    <p>Just replace the <span class="inline-code">YOUR_PROJECT_ID</span> with your actual project Id and the <span class="inline-code">TOPIC_STRING</span> with your actual topic string.</p>
    <p>For example, if your project Id is <span class="inline-code">ABCDEFGHIJKLMN</span>, and the topic string you choose is <span class="inline-code">Contact</span>, the link under "action" should be <span class="inline-code">https://sfb.sengstech.com/api/submit/ABCDEFGHIJKLMN/Contact</span></p>
    <p></p>
	</section>
  <section>
    <h2 class="h2">Advanced Technics</h2>
    <pre class="code"><code>{{
`<form id="myForm">
  <div>
    <label for="name">Name</label>
    <input type="text" name="name">
  </div>
  <div>
    <label for="email">Email</label>
    <input type="email" name="email" >
  </div>
  <div>
    <p>Are you an existing customer?</p>
    <div>
      <input type="radio" id="new" name="existing_customer" value="new">
      <label for="new">No. I am a new customer.</label>
    </div>
    <div>
      <input type="radio" id="old" name="existing_customer" value="old">
      <label for="old">Yes. I am an existing customer.</label>
    </div>
  </div>
  <div>
    <label for="problem">How can we help you?</label>
    <br>
    <select name="problem">
      <option value="quote">I need a quote</option>
      <option value="help">I need help</option>
      <option value="other">Other</option>
    </select>
  </div>
  <div>
    <label for="message">Message</label>
    <textarea name="message" cols="30" rows="10"></textarea>
  </div>
  <button type="submit" id="submit-btn">Submit</button>
</form>

<script>
  let myForm=document.getElementById('myForm');
  let submitBtn=document.getElementById('submit-btn');

  myForm.onsubmit=async(event)=>{
    submitBtn.disabled=true
    event.preventDefault();

    let data={}
    let formData=new FormData(myForm);

    for (let [key, value] of formData.entries()) {
      data[key]=value;
    }
    
    try {
      let response = await fetch('https://sfb.sengstech.com/api/submit/YOUR_PROJECT_ID/YOUR_TOPIC', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      alert('Your message has been sent!')

      myForm.reset()
      
    } catch (error) {
      console.error(error)

      // Provide your user an alternative ways (e.g. email) to submit information.
      alert('Something went wrong. Please try again later. If the problem persists, please send us an email: contact@example.com')
    }

    submitBtn.disabled=false
  }
</script>
`}}</code></pre>
    <p>
      The example above shows our recommanded way to submit your forms to Simple Form Backend.
    </p>
    <h3 class="h3">autocomplete Attribute</h3>
    <p>Using the autocomplete attribute is a great way to improve user experience.</p>
    <p>Read more about autocomplete <a href="https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/autocomplete" target="_blank" class="link">here</a>.</p>
    <h3 class="h3">Customize Your Forms</h3>
    <p>The content of the form can be customized to suit your needs.</p>
    <p>You can read more about it <a href="https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input" target="_blank" class="link">here</a>.</p>
    <div class="bg-red-100 w-fit p-2">
      <h3 class="h3">Caveats</h3>
      <p>We do not support <a href="https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file" target="_blank" class="link">file type input</a>. Please do not use them.</p>
      <p>If you need your users to submit files or images, please ask your users to upload to third party hosting services like <a href="https://drive.google.com/" target="_blank" class="link">Google Drive</a> or <a href="https://imgur.com/" target="_blank" class="link">Imgur</a> first.</p>
      <p>You can then ask them to paste the sharable link to your form.</p>
    </div>
    <h3 class="h3">Using Javascript to Handle Form Submission</h3>
    <p>Using form action will automatically redirect your users to our website. Although we have a congratulation page, you can greatly improve the user experience by handling the submission yourself using Javascript.</p>
    <p>The code we provided between the script tags should work. All you need to do is to swap the <span class="inline-code">YOUR_PROJECT_ID</span> with your actual project Id and the <span class="inline-code">TOPIC_STRING</span> with your actual topic string.</p>
    <h3 class="h3">Prevent Spams</h3>
    <p>Please do not allow your user to submit the same information again while the form is being submitted or after the form has been submitted.</p>
    <p>The code above shows how to disable the submit button during the submission.</p>
    <p>The code above also shows to to clear the form after the the form has been submitted.</p>
  </section>
  <section>
    <h1 class="h1">FAQs</h1>
    <h2 class="h2">Why do I get a message saying "Invalid Route."</h2>
    <p>Please make sure you are sending a POST request. Please check out the examples above.</p>
    <h2 class="h2" id="credits">How does the credits work?</h2>
    <p>
      Every time a form is submitted, we will deduct 1 credit from your account.
    </p>
    <p>If you received a lot of spams, please <router-link to="/contact?reason=help" class="link">contact us</router-link> for support.</p>
  </section>
</div>
</template>

<style scoped >
.code{
  @apply bg-gray-900 text-white p-5 rounded my-5 w-fit
}
.inline-code{
  @apply bg-gray-200 text-black px-1 rounded-sm
}

p{
  @apply mt-2 mb-3 pr-4 w-screen max-w-screen-md
}

</style>

<script setup>
/**
 * 
 * @todo: make an npm package for easy integration (low priority)
 */
</script>