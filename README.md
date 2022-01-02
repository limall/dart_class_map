# dart_class_mapable
为一个dart class自动生成toMap函数以及Class.fromMap函数，方便dart class与json的序列化与反序列化

用法：在需要序列化的class上一行添加//@mapable_class@，然后在需要序列化的属性声明的那一项添加注释//@mapable@。  
最后调用main.js时把需要序列化的文件的全局路径传入作为参数即可。
