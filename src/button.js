import Form from './form';
import './button.css';


const mountButton = (className, rverbio) => {
  const button = document.createElement('a');
  button.innerText = 'Feedback';
  button.classList.add('rverbio-button');
  button.classList.add('rverbio-button__feedback');

  if (className) {
    button.classList.add(className);
  }

  button.addEventListener('click', Form.openForm.bind(null, rverbio.shouldTakeScreenshot));

  document.body.appendChild(button);
};

export default { mountButton };
