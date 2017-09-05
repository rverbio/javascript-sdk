import html2canvas from 'html2canvas'; // eslint-disable-line
import './form.css';
import validation from './validation';

const formIds = {
  email: 'rverbio-email',
  emailValidation: 'rverbio-email-validation',
  comment: 'rverbio-comment',
  commentValidation: 'rverbio-comment-validation',
};

const mountForm = (appName, className, rverbio) => {
  // block
  const modal = document.createElement('aside');
  modal.id = 'rverbio-modal';
  modal.classList.add('rverbio-modal');

  modal.role = 'alertdialog';
  modal.setAttribute('aria-labelledby', 'Feedback');
  modal.setAttribute('aria-describedby', 'A dialog to provide feedback');

  if (className) {
    modal.classList.add(className);
  }

  // surface
  const surface = document.createElement('div');
  surface.classList.add('rverbio-modal--surface');
  modal.appendChild(surface);

  // header
  const header = document.createElement('header');
  header.classList.add('rverbio-modal--surface--header');
  surface.appendChild(header);

  // title
  const title = document.createElement('h2');
  title.classList.add('rverbio-modal--surface--header--title');
  title.innerText = `${appName} Feedback`;
  header.appendChild(title);

  // body
  const modalBody = document.createElement('section');
  modalBody.classList.add('rverbio-modal--surface--body');
  surface.appendChild(modalBody);

  // form
  const form = document.createElement('form');
  modalBody.appendChild(form);

  // comment
  const commentLabel = document.createElement('label');
  commentLabel.innerText = 'How can we help you?';
  form.appendChild(commentLabel);

  const commentArea = document.createElement('textarea');
  commentArea.id = formIds.comment;
  commentArea.rows = 5;
  commentArea.maxLength = 2000;
  commentArea.placeholder = 'Enter your comments here...';
  form.appendChild(commentArea);

  const commentValidation = document.createElement('span');
  commentValidation.id = formIds.commentValidation;
  commentValidation.classList.add('rverbio-modal--surface--body--validation');
  form.appendChild(commentValidation);

  // email
  if (!rverbio.isEmailSet()) {
    const emailLabel = document.createElement('label');
    emailLabel.innerText = 'Email Address';
    form.appendChild(emailLabel);

    const emailInput = document.createElement('input');
    emailInput.id = formIds.email;
    emailInput.placeholder = 'name@example.com';
    form.appendChild(emailInput);

    const emailValidation = document.createElement('span');
    emailValidation.id = formIds.emailValidation;
    emailValidation.classList.add('rverbio-modal--surface--body--validation');
    form.appendChild(emailValidation);
  }

  // screenshot
  const bottomContainer = document.createElement('div');
  bottomContainer.classList.add('rverbio-modal--surface--body--wrapper');
  form.appendChild(bottomContainer);

  const imageContainer = document.createElement('div');
  imageContainer.classList.add('rverbio-modal--surface--body--screenshot');
  bottomContainer.appendChild(imageContainer);

  // disclaimer
  const disclaimer = document.createElement('p');
  disclaimer.innerText = 'In order to provide excellent customer service, a screen shot and some additional data will be sent with this feedback.';
  bottomContainer.appendChild(disclaimer);

  // view metadata button
  const viewData = document.createElement('button');
  viewData.type = 'button';
  viewData.innerText = 'View Data';
  viewData.classList.add('rverbio-button');
  viewData.classList.add('rverbio-button__emphasis');
  viewData.addEventListener('click', () => {
    const newWindow = window.open();
    newWindow.document.write('<h1>Data to be included</h1>');
    newWindow.document.write('<dl>');
    const context = rverbio.getContext();
    Object.getOwnPropertyNames(context)
      .map(key => newWindow.document.write(`<dt>${key}</dt><dd>${context[key]}</dd>`));
    newWindow.document.write('</dl>');
  });
  bottomContainer.appendChild(viewData);

  // edit screenshot
  if (rverbio.shouldTakeScreenshot) {
    const editScreenShot = document.createElement('button');
    editScreenShot.type = 'button';
    editScreenShot.innerText = 'Remove Screenshot';
    editScreenShot.classList.add('rverbio-button');
    editScreenShot.classList.add('rverbio-button__emphasis');
    bottomContainer.appendChild(editScreenShot);

    const removeScreenShot = () => {
      modal.querySelectorAll('.rverbio-modal--surface--body--screenshot *').forEach((element) => {
        element.remove();
      });
      delete window.rvebio_screenshot_blob;
    };

    editScreenShot.addEventListener('click', removeScreenShot);
  }

  // powered by rverbio
  const poweredBy = document.createElement('div');
  poweredBy.classList.add('rverbio-powered-by');
  poweredBy.innerText = 'Powered by rverb.io';
  form.appendChild(poweredBy);

  // footer
  const footer = document.createElement('footer');
  footer.classList.add('rverbio-modal--surface--footer');
  surface.appendChild(footer);

  // cancel button
  const cancel = document.createElement('button');
  cancel.classList.add('rverbio-button');
  cancel.type = 'button';
  cancel.innerText = 'Cancel';
  footer.appendChild(cancel);

  // send button
  const send = document.createElement('button');
  send.classList.add('rverbio-button');
  send.type = 'button';
  send.innerText = 'Send';
  footer.appendChild(send);


  // backdrop
  const backdrop = document.createElement('div');
  backdrop.classList.add('rverbio-modal--backdrop');
  modal.appendChild(backdrop);

  document.body.appendChild(modal);

  const close = () => {
    backdrop.style.opacity = 0;
    surface.style.transform = 'translateY(150px) scale(.8)';
    surface.style.opacity = 0;
    setTimeout(() => {
      modal.style.visibility = 'hidden';
      form.reset();
    }, 200);
  };

  const submit = () => {
    send.disabled = true;
    const email = document.getElementById(formIds.email);
    const emailValidation = document.getElementById(formIds.emailValidation);
    let hasError = false;

    if (email && !validation.isValidEmail(email.value)) {
      emailValidation.innerText = 'A valid email is required';
      hasError = true;
    } else if (email) {
      emailValidation.innerText = '';
    }

    if (validation.isNullOrWhiteSpace(commentArea.value)) {
      commentValidation.innerText = 'Enter a comment';
      hasError = true;
    } else {
      commentValidation.innerText = '';
    }

    if (!hasError) {
      send.innerText = 'Sending...';

      if (email) {
        rverbio.setUserEmail(email.value);
      }

      // attach image if it exists
      const image = window.rvebio_screenshot_blob;

      rverbio.feedback({ comment: commentArea.value, image })
        .then(() => { send.disabled = false; send.innerText = 'Send'; })
        .then(close);
    } else {
      send.disabled = false;
    }
  };

  backdrop.addEventListener('click', close);
  cancel.addEventListener('click', close);
  send.addEventListener('click', submit);
};

const openForm = (shouldTakeScreenShot) => {
  const modal = document.getElementById('rverbio-modal');
  if (modal) {
    modal.querySelectorAll('.rverbio-modal--surface--body--screenshot *').forEach((element) => {
      element.remove();
    });

    const task = shouldTakeScreenShot ? html2canvas(document.body, { background: '#fff' }).then((canvas) => {
      canvas.toBlob((blob) => {
        window.rvebio_screenshot_blob = blob;
      });

      const image = new Image();
      image.src = canvas.toDataURL('image/png');
      modal.querySelector('.rverbio-modal--surface--body--screenshot').appendChild(image);
    }) : Promise.resolve();

    task.then(() => {
      modal.style.visibility = 'visible';
      modal.querySelector('.rverbio-modal--backdrop').style.opacity = '.3';
      modal.querySelector('.rverbio-modal--surface').style.transform = 'translateY(0) scale(1)';
      modal.querySelector('.rverbio-modal--surface').style.opacity = 1;
    });
  } else {
    // eslint-disable-next-line
    console.error('Cannot find the rverbio form, did you forget to mount it?');
  }
};

export default { mountForm, openForm };
