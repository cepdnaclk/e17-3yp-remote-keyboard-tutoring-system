import 'package:flutter/material.dart';
import 'ble_screen/ble_screen.dart';

typedef ItemTapCallback = void Function(Map<String, dynamic> item);

class ProvHomeScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
        appBar: AppBar(
          backgroundColor: Color.fromRGBO(134, 162, 242, 1),
          title: const Text('ESP Provisioning'),
        ),
        body: Center(
          child: MaterialButton(
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
        ));
  }
}
