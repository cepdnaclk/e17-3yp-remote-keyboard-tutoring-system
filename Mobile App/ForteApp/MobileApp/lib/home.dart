import 'package:flutter/material.dart';

final Color backgroundColor = Color.fromRGBO(214, 227, 247, 1);

class Home extends StatelessWidget {
  const Home(
      {Key key,
      this.isCollapsed,
      this.screenWidth,
      this.screenHeight,
      this.scalAnimation,
      this.duration,
      this.onMenuTap,
      this.child})
      : super(key: key);

  final bool isCollapsed;
  final double screenWidth, screenHeight;
  final Animation<double> scalAnimation;
  final Duration duration;
  final Function onMenuTap;
  final Widget child;

  @override
  Widget build(BuildContext context) {
    return AnimatedPositioned(
      top: 0,
      bottom: 0,
      left: isCollapsed ? 0 : 0.6 * screenWidth,
      right: isCollapsed ? 0 : -.4 * screenWidth,
      duration: duration,
      child: ScaleTransition(
        scale: scalAnimation,
        child: Material(
          borderRadius: isCollapsed
              ? BorderRadius.all(Radius.circular(0))
              : BorderRadius.all(Radius.circular(20)),
          elevation: 8,
          color: Color.fromRGBO(214, 227, 247, 1.0),
          child: Container(
            padding: const EdgeInsets.only(top: 70),
            child: child,
          ),
        ),
      ),
    );
  }
}
