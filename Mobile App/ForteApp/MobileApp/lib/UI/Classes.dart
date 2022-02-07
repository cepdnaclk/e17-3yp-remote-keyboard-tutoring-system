import 'package:esp_provisioning_example/bloc/navigation_bloc/navigation_bloc.dart';
import 'package:flutter/material.dart';


class Classes extends StatelessWidget with NavigationStates{
  const Classes({Key key, this.onMenuTap, this.isCollapsed}) : super(key: key);
  final bool isCollapsed;
  final Function onMenuTap;

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          mainAxisSize: MainAxisSize.max,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Container(
                    padding: const EdgeInsets.only(left: 10, right: 10),
                    child: InkWell(
                      customBorder: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(5),
                      ),
                      child: Icon(Icons.menu_rounded, color: Color.fromRGBO(58, 66, 118, 1)), onTap: () => onMenuTap(),)),
                Text("Classes!", style: TextStyle(fontSize: 24, color: Color.fromRGBO(58, 66, 118, 1), fontFamily: 'Poppins', fontWeight: FontWeight.w800)),
              ],
            ),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Container(padding: const EdgeInsets.only(left: 10, right: 10),
                    child: Icon(Icons.search, color: Color.fromRGBO(58, 66, 118, 1))),
                Container(padding: const EdgeInsets.only(left:1, right: 10),child: Icon(Icons.notifications_sharp, color: Color.fromRGBO(58, 66, 118, 1))),
              ],
            )
          ],
        ),
        SizedBox(height: 50),
        Container(
          height: 200,
          child: PageView(
            controller: PageController(viewportFraction: 0.7),
            scrollDirection: Axis.horizontal,
            pageSnapping: true,
            children: [
              Stack(
                children: [
                  ClipRRect(
                    borderRadius: BorderRadius.all(Radius.circular(10)),
                    child: Image(
                      image: AssetImage('assets/M2.jpg'),
                      fit: BoxFit.fill,
                      height: 200,
                      width: 250,
                    ),
                  ),
                  ListTile(
                    title: Text('Piano Studio',
                      style: TextStyle(fontFamily: 'Poppins',shadows: [Shadow(blurRadius: 10.0, color: Colors.lightBlueAccent, offset: Offset(1.0, 1.0))]),),
                    subtitle: Text('15 lessons', style: TextStyle(fontFamily: 'Poppins',)),
                  ),
                ],
              ),
              Stack(
                children: [
                  ClipRRect(
                    borderRadius: BorderRadius.all(Radius.circular(10)),
                    child: Image(
                      image: AssetImage('assets/M1.jpg'),
                      fit: BoxFit.fill,
                      height: 200,
                      width: 250,
                    ),
                  ),
                  ListTile(
                    title: Text('Académie de pianistes',
                      style: TextStyle(fontFamily: 'Poppins',shadows: [Shadow(blurRadius: 10.0, color: Colors.lightBlueAccent, offset: Offset(1.0, 1.0))]),),
                    subtitle: Text('20 lessons', style: TextStyle(fontFamily: 'Poppins',)),
                  ),
                ],
              ),
              Stack(
                children: [
                  ClipRRect(
                    borderRadius: BorderRadius.all(Radius.circular(10)),
                    child: Image(
                      image: AssetImage('assets/M3.jpg'),
                      fit: BoxFit.fill,
                      height: 200,
                      width: 250,
                    ),
                  ),
                  ListTile(
                    title: Text('Académie de pianistes',
                      style: TextStyle(fontFamily: 'Poppins',shadows: [Shadow(blurRadius: 10.0, color: Colors.lightBlueAccent, offset: Offset(1.0, 1.0))]),),
                    subtitle: Text('20 lessons', style: TextStyle(fontFamily: 'Poppins',),),
                  ),
                ],
              ),
            ],
          ),
        ),
      ],
    );
  }
}
