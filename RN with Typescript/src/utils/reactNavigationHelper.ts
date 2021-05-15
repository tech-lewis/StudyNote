import { NavigationActions } from "react-navigation";

let _navigatorRef;

const setNavigatorRef = navigatorRef => {
  _navigatorRef = navigatorRef;
};

const navigate = (routeName: string, params: any) => {
  _navigatorRef.current.dispatch(
    NavigationActions.navigate({
      routeName,
      params
    })
  );
};

const reactNavigationHelper = {
  setNavigatorRef,
  navigate
};

export default reactNavigationHelper;
