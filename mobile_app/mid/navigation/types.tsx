export type AuthParamList = {
  Login: undefined;
  Registration: undefined;
};

export type UserParamList = {
  BottomTabNavigator: undefined;
};

export type BottomTabParamList = {
  TabOne: undefined;
  TabTwo: undefined;
};

export type TabOneParamList = {
  HomeScreen: undefined;
};

export type TabTwoParamList = {
  TabTwoScreen: undefined;
};

export type RootStackParamList = AuthParamList | UserParamList;
