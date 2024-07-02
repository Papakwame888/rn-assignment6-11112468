import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, Image, StyleSheet, Button, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const products = [
  { id: '1', category: 'Office Wear', name: 'reversible angora cardigan', description: 'reversible angora cardigan', price: '$120', image: require('./image1.png') },
  { id: '2', category: 'Office Wear', name: 'reversible angora cardigan', description: 'reversible angora cardigan', price: '$120', image: require('./image2.png') },
  { id: '3', category: 'Church Wear', name: 'reversible angora cardigan', description: 'reversible angora cardigan', price: '$120', image: require('./image3.png') },
  { id: '4', category: 'Church Wear', name: 'Recycle Boucle Knit Cardigan Pink', description: 'reversible angora cardigan', price: '$120', image: require('./image4.png') },
  { id: '5', category: 'Lamerei', name: 'reversible angora cardigan', description: 'reversible angora cardigan', price: '$120', image: require('./image5.png') },
  { id: '6', category: '21WN', name: 'reversible angora cardigan', description: 'reversible angora cardigan', price: '$120', image: require('./image6.png') },
  { id: '7', category: '21WN', name: 'reversible angora cardigan', description: 'reversible angora cardigan', price: '$120', image: require('./image7.png') },
  { id: '8', category: 'Lopo', name: 'reversible angora cardigan', description: 'reversible angora cardigan', price: '$120', image: require('./image8.png') },
];

const App = () => {
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);

  useEffect(() => {
    const loadCart = async () => {
      try {
        const storedCart = await AsyncStorage.getItem('cart');
        if (storedCart) {
          setCart(JSON.parse(storedCart));
        }
      } catch (error) {
        console.error('Failed to load cart', error);
      }
    };
    loadCart();
  }, []);

  const addToCart = async (product) => {
    const updatedCart = [...cart, product];
    setCart(updatedCart);
    await AsyncStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const removeFromCart = async (productId) => {
    const updatedCart = cart.filter((item) => item.id !== productId);
    setCart(updatedCart);
    await AsyncStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const renderProductCard = (product) => (
    <View style={styles.card} key={product.id}>
      <Image source={product.image} style={styles.image} />
      <Text style={styles.name}>{product.name}</Text>
      <Text style={styles.description}>{product.description}</Text>
      <Text style={styles.price}>{product.price}</Text>
      <Button title="Add to Cart" onPress={() => addToCart(product)} />
    </View>
  );

  const renderCartProductCard = (product) => (
    <View style={styles.card} key={product.id}>
      <Image source={product.image} style={styles.image} />
      <Text style={styles.name}>{product.name}</Text>
      <Text style={styles.description}>{product.description}</Text>
      <Text style={styles.price}>{product.price}</Text>
      <Button title="Remove from Cart" onPress={() => removeFromCart(product.id)} />
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>O U R S t o r y</Text>
      <TouchableOpacity style={styles.cartButton} onPress={() => setShowCart(!showCart)}>
        <Text style={styles.cartButtonText}>{showCart ? 'View Products' : 'View Cart'}</Text>
      </TouchableOpacity>
      {showCart ? (
        <CartScreen cart={cart} renderCartProductCard={renderCartProductCard} />
      ) : (
        <ProductScreen renderProductCard={renderProductCard} />
      )}
    </ScrollView>
  );
};

const ProductScreen = ({ renderProductCard }) => {
  const categories = [...new Set(products.map((product) => product.category))];

  return (
    <>
      {categories.map((category) => (
        <View style={styles.section} key={category}>
          <Text style={styles.sectionHeader}>{category}</Text>
          <View style={styles.row}>
            {products.filter((product) => product.category === category).map(renderProductCard)}
          </View>
        </View>
      ))}
    </>
  );
};

const CartScreen = ({ cart, renderCartProductCard }) => {
  const total = cart.reduce((sum, item) => sum + parseInt(item.price.replace('$', ''), 10), 0);

  return (
    <View style={styles.section}>
      <Text style={styles.sectionHeader}>Checkout</Text>
      <View style={styles.row}>{cart.map(renderCartProductCard)}</View>
      <Text style={styles.total}>Est. Total: ${total}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
  },
  section: {
    marginHorizontal: 20,
    marginVertical: 10,
  },
  sectionHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  card: {
    width: '48%',
    marginBottom: 20,
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
    marginBottom: 10,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  description: {
    fontSize: 14,
    color: '#333',
    marginBottom: 5,
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  total: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginTop: 10,
  },
  cartButton: {
    backgroundColor: '#000',
    padding: 10,
    margin: 10,
    borderRadius: 5,
  },
  cartButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default App;

