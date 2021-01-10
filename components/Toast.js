import Toast from 'react-native-root-toast';

// system toast message component
function showToastMessage(message, position = -150) {
  this.toast = Toast.show(message, {
    duration: 2000,
    position: position,
    onPress: () => {
      alert('You clicked me!')
    },
    onHidden: () => {
      this.toast.destroy();
      this.toast = null;
    }
  });
};

export default {
  showToastMessage
};
