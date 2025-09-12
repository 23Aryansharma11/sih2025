import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

class OauthScreen extends StatefulWidget {
  const OauthScreen({super.key});

  @override
  State<OauthScreen> createState() => _OauthScreenState();
}

class _OauthScreenState extends State<OauthScreen> {
  @override
  Widget build(BuildContext context) {

    SystemChrome.setSystemUIOverlayStyle(
      const SystemUiOverlayStyle(
        systemNavigationBarColor: Colors.white,
        statusBarColor: Colors.white,
        systemNavigationBarIconBrightness: Brightness.dark,
      ),
    );

    return Scaffold(
      appBar: AppBar(
        title: const Text("OAuth Screen"),
      ),
      body: Column(
        children: [
          const Text("Hello")
        ],
      ),
    );
  }
}
