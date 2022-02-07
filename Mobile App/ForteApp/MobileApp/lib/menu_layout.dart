
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:esp_provisioning_example/bloc/navigation_bloc/navigation_bloc.dart';
import 'package:esp_provisioning_example/home.dart';
import 'package:esp_provisioning_example/mainMenu.dart';



final Color backgroundColor = Color.fromRGBO(214, 227, 247, 1);

class menuLayout extends StatefulWidget {
  const menuLayout({Key key}) : super(key: key);

  @override
  _menuLayoutState createState() => _menuLayoutState();
}

class _menuLayoutState extends State<menuLayout> with SingleTickerProviderStateMixin{

  bool isCollapsed = true;
  double screenWidth, screenHeight;
  final Duration duration = const Duration(milliseconds: 300);
  AnimationController _controller;
  Animation<double> _scalAnimation;
  Animation<Offset> _slideAnimation;
  @override
  void initState() {
    super.initState();
    _controller = AnimationController(vsync: this, duration: duration);
    _scalAnimation = Tween<double>(begin: 1, end: 0.7).animate(_controller);
    _slideAnimation = Tween<Offset>(begin: Offset(-1, 0), end: Offset(0, 0)).animate(_controller);
  }
  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  void onMenuTap(){
    setState(() {
      if (isCollapsed)
        _controller.forward();
      else
        _controller.reverse();
      isCollapsed = !isCollapsed;
    });
  }

  void onMenuItemClicked(){
    setState(() {
      _controller.reverse();
      isCollapsed = !isCollapsed;
    });
  }

  @override
  Widget build(BuildContext context) {
    Size size = MediaQuery.of(context).size;
    screenHeight = size.height;
    screenWidth = size.width;
    return GestureDetector(
      child: Scaffold(
        backgroundColor: Color.fromRGBO(134, 162, 242, 1),
        body: BlocProvider<NavigationBloc>(
          create: (context) => NavigationBloc(onMenuTap: onMenuTap, isCollapsed: isCollapsed),
          child: Stack(
            children: [
              Home(isCollapsed: this.isCollapsed, screenWidth: screenWidth, screenHeight: screenHeight, scalAnimation: _scalAnimation, duration: duration, onMenuTap: onMenuTap,
                  child: BlocBuilder<NavigationBloc, NavigationStates>(builder: (context,
                      NavigationStates navigationState,) {
                    return navigationState as Widget;
                  }),

                ),
              MainMenu(slideAnimation: _slideAnimation, onMenuTap: onMenuTap, onMenuItemClicked: onMenuItemClicked,)
            ],
          ),
        ),
      ),
      onPanUpdate: (details) {
        // Swiping in right direction.
        if (details.delta.dx > 0) {
          if(isCollapsed){
            onMenuTap();
          }
        }

        // Swiping in left direction.
        if (details.delta.dx < 0) {
          if(!isCollapsed){
            onMenuTap();
          }
        }
      },
    );
  }

}

