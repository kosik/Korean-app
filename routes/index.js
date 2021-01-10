import {
  createStackNavigator,
  createAppContainer,
  createDrawerNavigator,
  createSwitchNavigator,
} from 'react-navigation';

import SideMenu from '../components/SideMenu';
import SignIn from './SignIn';
import Main from './Main';
import QR from './QR';
import MyInfo from './SideMenu/MyInfo';
import Reward from './SideMenu/Reward';
import BankAccount from './SideMenu/BankAccount';
import Ranking from './SideMenu/Ranking';
import Register from './SignIn/Register';
import PhoneNumberAuthentication from './SignIn/PhoneNumberAuthentication';
import EditInfo from './SideMenu/EditInfo';

const SignInNavigator = createStackNavigator(
  {
    SignIn: {
      screen: SignIn,
    },
    Register: {
      screen: Register
    },
    PhoneAuth: {
      screen: PhoneNumberAuthentication
    },

  },
  {
    initialRouteName: 'SignIn',
    headerMode: 'none',
  },
);

const DrawerNavigator = createDrawerNavigator(
  {
    Main: {
      screen: Main,
    },
    QR: {
      screen: QR,
    },
    BankAccount: {
      screen: BankAccount
    },
    Reward: {
      screen: Reward
    },
    Ranking: {
      screen: Ranking
    },
    MyInfo: {
      screen: MyInfo
    },
    EditInfo: {
      screen: EditInfo
    }
  },
  {
    contentComponent: SideMenu,
    hideStatusBar: false,
    overlayColor: '#3d5565',
    drawerPosition: 'right',
    drawerWidth: 330
  },
);

const AppNavigator = createSwitchNavigator(
  {
    SignInNavigator,
    DrawerNavigator,
  },
  {
    initialRouteName: 'SignInNavigator',
  },
);

export default createAppContainer(AppNavigator);
