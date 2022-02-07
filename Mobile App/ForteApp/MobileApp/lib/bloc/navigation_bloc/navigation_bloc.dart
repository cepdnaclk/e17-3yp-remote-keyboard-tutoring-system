import 'package:bloc/bloc.dart';
// import 'package:rkt_mobile/UI/Classes.dart';
import 'package:esp_provisioning_example/UI/Classes.dart';
import 'package:esp_provisioning_example/UI/dashboard.dart';
import 'package:esp_provisioning_example/UI/device.dart';

enum  NavigationEvents{
  HomeClickEvent,
  ClassesClickEvent,
  DeviceClickEvent,
}

abstract class NavigationStates{}

class NavigationBloc extends Bloc<NavigationEvents, NavigationStates>{
  final Function onMenuTap;
  final bool isCollapsed;

  NavigationBloc({ this.onMenuTap,  this.isCollapsed} ) : super(DashBoard(isCollapsed: isCollapsed, onMenuTap: onMenuTap));


  @override
  Stream<NavigationStates> mapEventToState(NavigationEvents event) async*{
    switch(event){
      case NavigationEvents.HomeClickEvent:
        yield DashBoard(isCollapsed: isCollapsed, onMenuTap: onMenuTap);
        break;
      case NavigationEvents.ClassesClickEvent:
        yield Classes(isCollapsed: isCollapsed, onMenuTap: onMenuTap);
        break;
      case NavigationEvents.DeviceClickEvent:
        yield Device(isCollapsed: isCollapsed, onMenuTap: onMenuTap);
        break;
    }
  }

}