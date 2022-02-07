import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:esp_provisioning_example/bloc/navigation_bloc/navigation_bloc.dart';

double fSize = 18;
class MainMenu extends StatelessWidget{
  const MainMenu({Key key, this.slideAnimation, this.onMenuTap, this.onMenuItemClicked}) : super(key: key);

  final Animation<Offset> slideAnimation;
  final Function onMenuTap;
  final Function onMenuItemClicked;
  @override
  Widget build(BuildContext context) {
    return Container(
      child: SlideTransition(
        position: slideAnimation,
        child: Padding(
          padding: const EdgeInsets.only(left: 16.0, top: 70),
          child: Align(
            alignment: Alignment.topLeft,
            child: Column(
              mainAxisSize: MainAxisSize.min,
              mainAxisAlignment: MainAxisAlignment.spaceAround,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                ListTile(
                  title: Text('User 1', style: TextStyle(fontFamily: 'Poppins', color: Colors.white, fontSize: fSize + 5,),),
                  subtitle: Text('sample@gmail.com',style: TextStyle(fontFamily: 'Poppins', color: Colors.white, fontSize: 15,)),
                  leading: CircleAvatar(
                    radius: 25,
                    child: Icon(
                      Icons.perm_identity_rounded,
                      color: Colors.white,
                      size: 35,
                    ),
                  ),
                ),
                Divider(
                  thickness: 1,
                  endIndent: MediaQuery.of(context).size.width*0.35,
                  color: Colors.white,
                ),
                SizedBox(height: 10),
                InkWell(
                  customBorder: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(20),
                  ),
                  child: Container(
                  width: MediaQuery.of(context).size.width*0.65,
                  height: 40,
                  child: Row(
                    children: [
                      SizedBox(width: 10,),
                      ImageIcon(
                        AssetImage('assets/home.png'),
                        color: Colors.white,
                      ),
                      SizedBox(width: 10,),
                      Text("Home", style: TextStyle(color: Colors.white, fontSize: fSize, fontFamily: 'Poppins'),),
                    ],
                  ),
                ),
                  onTap: () {
                    BlocProvider.of<NavigationBloc>(context).add(NavigationEvents.HomeClickEvent);
                    onMenuItemClicked();
                  }
                  ,),
                SizedBox(height: 10),
                InkWell(
                  customBorder: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(20),
                  ),
                  child: Container(
                  width: MediaQuery.of(context).size.width*0.65,
                  height: 40,
                  child: Row(
                    children: [
                      SizedBox(width: 10,),
                      ImageIcon(
                        AssetImage('assets/courses.png'),
                        color: Colors.white,
                      ),
                      SizedBox(width: 10,),
                      Text("Classes", style: TextStyle(color: Colors.white, fontSize: fSize, fontFamily: 'Poppins'),),
                    ],
                  ),
                ),
                  onTap: () {
                    BlocProvider.of<NavigationBloc>(context).add(NavigationEvents.ClassesClickEvent);
                    onMenuItemClicked();
                  }
                  ,),
                SizedBox(height: 10),
                InkWell(
                  customBorder: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(20),
                  ),
                  child: Container(
                    width: MediaQuery.of(context).size.width*0.65,
                    height: 40,
                    child: Row(
                      children: [
                        SizedBox(width: 10,),
                        ImageIcon(
                          AssetImage('assets/sheets.png'),
                          color: Colors.white,
                        ),
                        SizedBox(width: 10,),
                        Text("Sheets", style: TextStyle(color: Colors.white, fontSize: fSize, fontFamily: 'Poppins'),),
                      ],
                    ),
                  ),
                  onTap: () {
                    BlocProvider.of<NavigationBloc>(context).add(NavigationEvents.ClassesClickEvent);
                    onMenuItemClicked();
                  }
                  ,),
                SizedBox(height: 10),
                InkWell(
                  customBorder: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(20),
                  ),
                  child: Container(
                    width: MediaQuery.of(context).size.width*0.65,
                    height: 40,
                    child: Row(
                      children: [
                        SizedBox(width: 10,),
                        ImageIcon(
                          AssetImage('assets/recordings.png'),
                          color: Colors.white,
                        ),
                        SizedBox(width: 10,),
                        Text("Recordings", style: TextStyle(color: Colors.white, fontSize: fSize, fontFamily: 'Poppins'),),
                      ],
                    ),
                  ),
                  onTap: () {
                    BlocProvider.of<NavigationBloc>(context).add(NavigationEvents.ClassesClickEvent);
                    onMenuItemClicked();
                  }
                  ,),
                SizedBox(height: 10),
                InkWell(
                    customBorder: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(20),
                    ),
                    child: Container(
                      width: MediaQuery.of(context).size.width*0.65,
                      height: 40,
                      child: Row(
                        children: [
                          SizedBox(width: 10,),
                          ImageIcon(
                            AssetImage('assets/Device.png'),
                            color: Colors.white,
                          ),
                          SizedBox(width: 10,),
                          Text("Device", style: TextStyle(color: Colors.white, fontSize: fSize, fontFamily: 'Poppins'),),
                        ],
                      ),
                    ),
                    onTap: () {
                      BlocProvider.of<NavigationBloc>(context).add(NavigationEvents.DeviceClickEvent);
                      onMenuItemClicked();
                    }
                ),
                SizedBox(height: 10),
                InkWell(
                  customBorder: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(20),
                  ),
                  child: Container(
                    width: MediaQuery.of(context).size.width*0.65,
                    height: 40,
                    child: Row(
                      children: [
                        SizedBox(width: 10,),
                        ImageIcon(
                          AssetImage('assets/settings.png'),
                          color: Colors.white,
                        ),
                        SizedBox(width: 10,),
                        Text("Settings", style: TextStyle(color: Colors.white, fontSize: fSize, fontFamily: 'Poppins'),),
                      ],
                    ),
                  ),
                ),
                SizedBox(height: 10),
                InkWell(
                  customBorder: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(20),
                  ),
                  child: Container(
                    width: MediaQuery.of(context).size.width*0.65,
                    height: 40,
                    child: Row(
                      children: [
                        SizedBox(width: 10,),
                        ImageIcon(
                          AssetImage('assets/help.png'),
                          color: Colors.white,
                        ),
                        SizedBox(width: 10,),
                        Text("Help", style: TextStyle(color: Colors.white, fontSize: fSize, fontFamily: 'Poppins'),),
                      ],
                    ),
                  ),
                  onTap: () {
                    BlocProvider.of<NavigationBloc>(context).add(NavigationEvents.ClassesClickEvent);
                    onMenuItemClicked();
                  }
                  ,),
                SizedBox(height: 20),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
