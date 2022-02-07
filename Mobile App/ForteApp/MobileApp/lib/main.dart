import 'package:flutter/material.dart';
import 'package:esp_provisioning_example/menu_layout.dart';
void main() {runApp(RKT());}

class RKT extends StatelessWidget {
  const RKT({Key key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: "Remote Keyboard Tutor",
      theme: ThemeData(
        primarySwatch: Colors.blue,
        splashColor: Colors.blueAccent,
      ),
      home: menuLayout(),
    );
  }
}


