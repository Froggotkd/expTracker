import React, { useContext, useRef, useState, useEffect } from 'react';
import { Text, View, TextInput, StyleSheet, FlatList, KeyboardAvoidingView, Platform, Image, TouchableWithoutFeedback, } from 'react-native';
import { DataContext } from '../App';
import { Button } from '@rneui/base';
import RBSheet from 'react-native-raw-bottom-sheet';

const RadioButton = (props) => {
  return (
    <TouchableWithoutFeedback onPress={props.onPress}>
      <View style={[{
        height: 22,
        width: 22,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#A37366',
        alignItems: 'center',
        justifyContent: 'center',
      }, props.style]}>
        {
          props.selected ?
            <View style={{
              height: 14,
              width: 14,
              borderRadius: 10,
              backgroundColor: '#A37366',
            }} />
            : null
        }
      </View>
    </TouchableWithoutFeedback>
  );
};

const Transacciones = ({ navigation }) => {
  const { transacciones, addTransaccion, categorias } = useContext(DataContext);
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [monto, setMonto] = useState('');
  const [tipo, setTipo] = useState('');
  const [fecha, setFecha] = useState('');
  const [categoria, setCategoria] = useState('');

  const refRBSheet = useRef();

  useEffect(() => {
    console.log('transacciones:', transacciones);
  }, [transacciones]);

  const handleAddTransaccion = () => {
    console.log('handleAddTransaccion called');
    console.log('Current state values:', { nombre, descripcion, monto, tipo, categoria });
    if (nombre && descripcion && monto && tipo && categoria) {
      const fecha = new Date().toLocaleString();
      addTransaccion(categoria, nombre, monto, fecha, descripcion, tipo);
      setNombre('');
      setDescripcion('');
      setMonto('');
      setFecha('');
      setCategoria('');
      setTipo('');
      refRBSheet.current.close();
    } else {
      console.log('All fields are required');
    }
  };
  

  const ordenarCategorias = (array) => {
    return array.sort((a, b) => a.categoria_nombre.localeCompare(b.categoria_nombre));
  }
  const categoriasOrdenadas = ordenarCategorias(categorias);

  const Item = ({ nombre, descripcion }) => (
    <View style={styles.item}>
      <View style={styles.itemContent}>
        <View style={styles.itemText}>
          <Text style={styles.title}>{nombre}</Text>
          <Text style={styles.description}>{descripcion}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <View style={styles.header}>
        <Button
          icon={<Image source={require('../assets/icons/casa.png')} style={{ width: 25, height: 25 }} />}
          buttonStyle={styles.homeButton}
          onPress={() => navigation.navigate('Welcome')}
        />
        <Button
          icon={<Image source={require('../assets/icons/categoria.png')} style={{ width: 25, height: 25 }} />}
          buttonStyle={[styles.homeButton, { marginRight: 110 }]}
          onPress={() => navigation.navigate('Categoria')}
        />
        <Image source={require('../assets/images/Logo.png')} style={{ width: 152, height: 40, marginTop: 29 }} />
      </View>

      <RBSheet
        ref={refRBSheet}
        height={600}
        openDuration={300}
        customStyles={{
          container: {
            padding: 15,
            justifyContent: 'center',
            alignItems: 'center',
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
          }
        }}
      >

        <Text style={styles.addTransaccion}>Añadir Transacción</Text>
        <View style={styles.radioButtonContainer}>
          <View style={styles.radioButtonRow}>
            <RadioButton
              selected={tipo === 'Ingreso'}
              onPress={() => setTipo('Ingreso')}
              style={styles.radioButton}
            />
            <Text style={styles.radioText}>Ingreso</Text>
          </View>
          <View style={styles.radioButtonRow}>
            <RadioButton
              selected={tipo  === 'Gasto'}
              onPress={() => setTipo('Gasto')}
              style={styles.radioButton}
            />
            <Text style={styles.radioText}>Gasto</Text>
          </View>
        </View>
        <View style={styles.nombreContainer}>
          <TextInput
            style={styles.inputNombre}
            placeholder="Nombre"
            value={nombre}
            onChangeText={setNombre}
          />
          <Text style={styles.signoDolar}>$</Text>
          <TextInput
            style={styles.inputMonto}
            placeholder='Monto'
            keyboardType='numeric'
            value={monto}
            onChangeText={setMonto}
          />
        </View>
        <TextInput
          style={styles.input}
          placeholder="Descripción"
          value={descripcion}
          onChangeText={setDescripcion}
        />
        <Text style={styles.catText}>Selecciona una categoría!</Text>
        <FlatList
          data={categoriasOrdenadas}
          renderItem={({ item }) => (
            <TouchableWithoutFeedback onPress={() => setCategoria(item.categoria_id)}>
              <View style={[styles.item, categoria === item.categoria_id && styles.selectedItem]}>
                <View style={{ flexDirection: 'row' }}>
                  <View style={[styles.circularTextView, { backgroundColor: item.categoria_color }]} />
                  <Text style={styles.itemText}>{item.categoria_nombre}</Text>
                </View>
              </View>
            </TouchableWithoutFeedback>
          )}
          keyExtractor={(item, index) => index.toString()}
        />

        <Button
          buttonStyle={styles.addNombreButton}
          onPress={handleAddTransaccion}
          titleStyle={{ color: '#fff' }}
          title="Listo!"
        />
      </RBSheet>

      <View style={styles.content}>
        <FlatList
          data={transacciones}
          renderItem={({ item }) => (
            <Item
              nombre={item.transaccion_nombre}
              descripcion={item.transaccion_descripcion}
            />
          )}
          keyExtractor={(item) => item.transaccion_id.toString()}
          style={styles.flatList}
        />
      </View>

      <Button
        title='Añadir nueva transacción'
        buttonStyle={styles.changeColor}
        onPress={() => refRBSheet.current.open()}
      />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  catText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10
  },
  inputMonto: {
    fontSize: 18,
    marginRight: 35,
    marginTop: 1
  },
  signoDolar: {
    fontSize: 25,
    fontWeight: '400',
    marginRight: 10
  },
  circularTextView: {
    width: 10,
    height: 30,
    borderRadius: 50,
    marginLeft: 10,
    marginRight: 15
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
  },
  changeColor: {
    alignSelf: 'center',
    marginVertical: 20,
    width: 250,
    height: 50,
    marginHorizontal: 10,
    borderRadius: 10,
    borderColor: '#A37366',
    borderWidth: 2,
    backgroundColor: '#A37366',
  },
  addTransaccion: {
    fontSize: 25,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  container: {
    flex: 1,
    backgroundColor: '#E0F7FA',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    backgroundColor: '#fff',
    marginBottom: 10,
  },
  homeButton: {
    width: 50,
    backgroundColor: '#fff',
    borderColor: '#000',
    height: 40,
    marginTop: 30,
    marginLeft: 10,
  },
  content: {
    flex: 1,
    paddingHorizontal: 15,
  },
  flatList: {
    flex: 1,
  },
  inputContainer: {
    padding: 15,
    paddingHorizontal: 45,
    alignItems: 'center',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
  },
  nombreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 8,
  },
  inputNombre: {
    color: '#000',
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#fff',
    flex: 1,
    borderColor: '#FFFFFF',
    borderWidth: 1,
    marginRight: 10,
    fontSize: 18
  },
  input: {
    color: '#000',
    padding: 10,
    marginVertical: 8,
    borderRadius: 8,
    backgroundColor: '#fff',
    width: '100%',
    borderColor: '#FFFFFF',
    borderWidth: 1,
    fontSize: 18
  },
  addNombreButton: {
    backgroundColor: '#A37366',
    borderRadius: 20,
    height: 45,
    width: 120,
    paddingHorizontal: 15,
    marginHorizontal: 10,
  },
  addButton: {
    backgroundColor: '#A37366',
    width: 320,
    marginTop: 10,
    borderRadius: 8,
  },
  item: {
    backgroundColor: '#fff',
    padding: 10,
    marginVertical: 8,
    paddingHorizontal: 100,
    marginHorizontal: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  selectedItem: {
    backgroundColor: '#D3AEA2',
  },
  itemText: {
    alignSelf: 'center',
    fontSize: 15,
  },
  itemContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#000'
  },
  description: {
    fontSize: 14,
    color: '#757575',
    marginTop: 5,
  },
  deleteButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 10,
  },
  colorContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap-reverse',
    justifyContent: 'space-around',
    marginVertical: 10,
    width: '100%',
  },
  radioButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
    width: '90%',
  },
  radioButtonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  radioButton: {
    marginHorizontal: 6,
  },
  radioText: {
    fontSize: 18,
  },
});

export default Transacciones;