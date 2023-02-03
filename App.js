import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';

import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const App = () => {
  const [historyData, setHistoryData] = useState([]);
  const [filteredDataSource, setFilteredDataSource] = useState([]);
  const [masterDataSource, setMasterDataSource] = useState([]);
  const [search, setSearch] = useState('');


  useEffect(() => {
    getHistoryByLocal();
  }, []);

  const getHistoryByLocal = async () => {
    const data = await AsyncStorage.getItem('historyData');
    if (data === null) {
      setHistoryData([]);
    } else {
      setHistoryData(JSON.parse(data));
    }
  };

   const onPressItem = (item) => {
     AsyncStorage.setItem('historyData', JSON.stringify([...historyData, item]));
    setHistoryData([...historyData, item]);
  };

  let url = `http://www.boredapi.com/api/activity/`

   const onPressAddData = () => {
    axios.get(url)
      .then(res => {
        setFilteredDataSource([...filteredDataSource, res.data]);
        setMasterDataSource([...masterDataSource, res.data]);
      })
  };

  const onChangeText = text => {
    if (text) {
      const newData = masterDataSource.filter(function (item) {
        const itemData = item.activity
          ? item.activity.toUpperCase()
          : ''.toUpperCase();
        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
      setFilteredDataSource(newData);
      setSearch(text);
    } else {
      setFilteredDataSource(masterDataSource);
      setSearch(text);
    }
  };

  const ListFooterComponentHistory = () => {
    if (historyData.length === 0) {
      return (
        <Text style={style.noDataFoundTextStyle}>
          {'No History found'}
        </Text>
      );
    } else {
      return null;
    }
  }

  const ListFooterComponent =() => {
    if (filteredDataSource.length === 0) {
      return (
        <Text style={style.noDataFoundTextStyle}>
          {'No List found'}
        </Text>
      );
    } else {
      return null;
    }
  }

const filteredDataSourceRenderItem = ({item, index}) => {
    return (
      <TouchableOpacity
        onPress={() => onPressItem(item, index)}
        style={style.historyItemStyle}>
        <Text>{item.activity}</Text>
      </TouchableOpacity>
    );
  }

 
  return (
    <SafeAreaView style={style.container}>
      <TextInput
        value={search}
        placeholder="Search here ....."
        style={style.inputStyle}
        onChangeText={onChangeText}
      />
      <ScrollView>
        <FlatList
          ListHeaderComponent={() => (
            <Text style={style.labelTextStyle}>{'History Data'}</Text>
            )}
          contentContainerStyle={{marginHorizontal: 20}}
          ItemSeparatorComponent={() => {
            return <View style={{borderWidth: 1}} />;
          }}
          data={historyData}
          renderItem={({item, index}) => {
            return (
              <TouchableOpacity style={style.historyItemStyle}>
                <Text>{item.activity}</Text>
              </TouchableOpacity>
            );
          }}
          ListFooterComponent={ListFooterComponentHistory}
        />

        <FlatList
          contentContainerStyle={{marginHorizontal: 20, marginTop: 30}}
          ListHeaderComponent={() => (
            <Text style={style.labelTextStyle}>{'List data'}</Text>
          )}
          ItemSeparatorComponent={() => {
            return <View style={{borderWidth: 1}} />;
          }}
          data={filteredDataSource}
          renderItem={filteredDataSourceRenderItem}
          ListFooterComponent={ListFooterComponent}
        />
      </ScrollView>

      <TouchableOpacity
        onPress={onPressAddData}
        style={style.floatingButtonStyle}>
        <Text style={style.addTextStyle}>{'Add'}</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const style = StyleSheet.create({
  container: {
    flex: 1,
  },
  inputStyle: {
    margin: 10,
    color: 'black',
    fontSize: 16,
    borderWidth: 1.5,
    borderRadius: 10,
    borderColor: 'black',
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  historyItemStyle: {
    padding: 10,
  },
  addTextStyle: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  floatingButtonStyle: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    backgroundColor: 'black',
    padding: 15,
    borderRadius: 1000,
    height:50,
    width:50,
  },
  noDataFoundTextStyle: {
    textAlign: 'center',
    padding: 20,
    color: 'gery',
    fontWeight: 'bold',
    fontSize: 14,
  },
  labelTextStyle: {
    color: 'black',
    fontWeight: 'bold',
  },
});

export default App;
