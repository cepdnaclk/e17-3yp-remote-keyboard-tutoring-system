import 'package:esp_provisioning_example/ProvMain.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:esp_provisioning_example/bloc/navigation_bloc/navigation_bloc.dart';
import 'dart:async';
import 'dart:convert' show utf8;
import 'package:flutter/material.dart';
import 'package:esp_provisioning_example/ble_screen/ble_screen.dart';

typedef ItemTapCallback = void Function(Map<String, dynamic> item);


class Device extends StatelessWidget with NavigationStates{
  const Device({Key key, this.isCollapsed, this.onMenuTap}) : super(key: key);
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
                Text("Device", style: TextStyle(fontSize: 24, color: Color.fromRGBO(58, 66, 118, 1), fontFamily: 'Poppins', fontWeight: FontWeight.w800)),
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
        Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            SizedBox(height: MediaQuery.of(context).size.height*0.6,),
            MaterialButton(
              color: Colors.blueAccent,
              elevation: 5,
              padding: EdgeInsets.all(15.0),
              shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.all(Radius.circular(5))),
              onPressed: () {
                Navigator.push(
                    context,
                    MaterialPageRoute(
                        builder: (BuildContext context) => BleScreen()));
              },
              child: Text(
                'Start Provisioning',
                style: Theme.of(context)
                    .textTheme
                    .headline6
                    .copyWith(color: Colors.white),
              ),
            ),
          ],
        ),
      ],
    );
  }
}
