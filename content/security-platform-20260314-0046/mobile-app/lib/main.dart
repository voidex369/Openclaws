import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:flutter_dotenv/flutter_dotenv.dart';

void main() async {
  await dotenv.load(fileName: ".env");
  runApp(MyApp());
}

class ScanProvider with ChangeNotifier {
  List<dynamic> _scans = [];
  List<dynamic> get scans => _scans;
  Future<void> fetchScans() async {
    final base = dotenv.get('API_BASE_URL');
    final res = await http.get(Uri.parse('$base/api/scans'));
    if (res.statusCode == 200) _scans = json.decode(res.body);
    notifyListeners();
  }
  Future<void> uploadScan(Map<String, dynamic> data) async {
    final base = dotenv.get('API_BASE_URL');
    await http.post(Uri.parse('$base/api/scans'),
        headers: {'Content-Type': 'application/json'}, body: json.encode(data));
    await fetchScans();
  }
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return ChangeNotifierProvider(
      create: (_) => ScanProvider()..fetchScans(),
      child: MaterialApp(home: HomeScreen()),
    );
  }
}

class HomeScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    final scans = context.watch<ScanProvider>().scans;
    return Scaffold(
      appBar: AppBar(title: Text('Security Dashboard')),
      body: ListView.builder(
        itemCount: scans.length,
        itemBuilder: (_, i) {
          final s = scans[i];
          return ListTile(
            title: Text(s['tool']),
            subtitle: Text('${s['severity']} - ${s['findings'].length} findings'),
          );
        },
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () async {/* implement file picker */},
        child: Icon(Icons.upload),
      ),
    );
  }
}
