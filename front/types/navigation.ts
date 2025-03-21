import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";

export type TabParamList = {
  Home: undefined;
  Login: undefined;
  Register: undefined;
  Messages: undefined;
  Applications: undefined;
  JobOffers: undefined;
  Profile: undefined;
  Jobs: undefined;
};

export type TabNavigationProp = BottomTabNavigationProp<TabParamList>;
