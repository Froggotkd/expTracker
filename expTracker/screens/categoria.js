import React, { useContext, useState } from 'react';
import { Text, View, TextInput, StyleSheet, FlatList } from 'react-native';
import { DataContext } from '../App';
import { Button } from '@rneui/base';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Categoria = ({navigation}) => {
  const { categorias, addCategoria, deleteCategoria } = useContext(DataContext);
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');


  const handleAddCategoria = () => {
    if (nombre && descripcion) {
      addCategoria(nombre, descripcion);
      setNombre('');
      setDescripcion('');
    }
  };


  const handleDeleteCategoria = (nombre) => {
    deleteCategoria(nombre);
  };

  const Item = ({ title, descripcion }) => (
    <View style={styles.item}>
      <View style={styles.row}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{descripcion}</Text>
        <Button title='Eliminar'  titleStyle={{color: '#000000'}} type='outline'buttonStyle={{height:39, borderColor:'#000000' }} onPress={() => handleDeleteCategoria(title)} />
      </View>
    </View>
  );

  return (
    <View style={styles.container} >
      <View style ={styles.row}>
        <Button title='Inicio' size='sm' buttonStyle={{ width: 175, borderColor:'#000000' }} titleStyle={{color: '#000000'}} type='outline' onPress={() => navigation.navigate('Añadir Transaccion')} />
        <Button title='Estadisticas' size='sm' titleStyle={{color: '#000000'}} buttonStyle={{ width: 175, borderColor:'#000000' }} type='outline'/>
      </View>
      
      <FlatList
        data={categorias}
        renderItem={({ item }) => <Item title={item.categoria_nombre} descripcion={item.categoria_descripcion} />}
        keyExtractor={(item) => item.categoria_id.toString()}
      />
      <TextInput
        style={styles.input}
        placeholder="Nombre de la Categoria"
        value={nombre}
        onChangeText={setNombre}
      />
      <TextInput
        style={styles.input}
        placeholder="Descripcion"
        value={descripcion}
        onChangeText={setDescripcion}
      />
      <Button title="Agregar Categoria" color="#000000" onPress={handleAddCategoria} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  input: {
    color: 'black',
    padding: 10,
    borderColor: 'black',
    borderWidth: 1,
    marginVertical: 8,
    borderRadius: 4,
  },
  item: {
    backgroundColor: '#f0f0f0',
    padding: 20,
    marginVertical: 8,
    borderRadius: 4,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  header: {
    fontSize: 24,
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    flex: 1,
    padding: 10
  },
  description: {
    fontSize: 14,
    color: 'black',
    textAlign: 'right',
    marginRight: 10,
    padding: 10
  },
});

export default Categoria;
