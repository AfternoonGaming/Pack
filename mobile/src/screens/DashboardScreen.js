import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  Modal,
  TextInput,
  Linking,
  Alert,
} from 'react-native';
import axios from 'axios';
import { COLORS, SIZES } from '../theme/colors';

const API_BASE_URL = 'http://your-backend-api.com/api';

export default function DashboardScreen({ route, navigation }) {
  const [servers, setServers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [serverName, setServerName] = useState('');
  const authToken = route.params?.authToken;

  useEffect(() => {
    fetchServers();
    const interval = setInterval(fetchServers, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchServers = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/servers`, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      setServers(response.data);
    } catch (error) {
      console.error('Failed to fetch servers:', error);
    } finally {
      setLoading(false);
    }
  };

  const createServer = async () => {
    if (!serverName.trim()) return;

    try {
      const response = await axios.post(
        `${API_BASE_URL}/servers`,
        { server_name: serverName },
        { headers: { Authorization: `Bearer ${authToken}` } }
      );
      
      const colab_url = response.data.server.colab_url;
      
      setServerName('');
      setModalVisible(false);
      
      Alert.alert(
        '✓ SERVER INITIALIZED',
        'Open Google Colab notebook. Paste your free ngrok token from https://dashboard.ngrok.com/auth and run all cells.',
        [
          { text: 'Cancel', onPress: () => {} },
          { 
            text: '[LAUNCH COLAB]', 
            onPress: () => {
              Linking.openURL(colab_url);
            }
          }
        ]
      );
      
      fetchServers();
    } catch (error) {
      Alert.alert('ERROR', `Failed to create server: ${error.message}`);
    }
  };

  const openColabNotebook = (colabUrl) => {
    Linking.openURL(colabUrl);
  };

  const renderServerCard = ({ item }) => (
    <View style={styles.serverCard}>
      <View style={styles.cardHeader}>
        <Text style={styles.serverName}>[{item.server_name}]</Text>
        <View style={[
          styles.statusBadge, 
          item.status === 'running' ? styles.statusRunning : 
          item.status === 'stopped' ? styles.statusStopped :
          styles.statusError
        ]}>
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>

      {item.ip_address ? (
        <>
          <Text style={styles.cardInfo}>➜ {item.ip_address}</Text>
          <TouchableOpacity 
            style={styles.copyButton}
            onPress={() => {
              Alert.alert('✓ COPIED', `${item.ip_address}`);
            }}
          >
            <Text style={styles.copyButtonText}>[COPY ADDRESS]</Text>
          </TouchableOpacity>
        </>
      ) : (
        <Text style={styles.cardInfo}>PORT: {item.port}</Text>
      )}

      <TouchableOpacity
        style={styles.colabButton}
        onPress={() => openColabNotebook(item.colab_url)}
      >
        <Text style={styles.colabButtonText}>[OPEN COLAB]</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={COLORS.neonGreen} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{'[ MINECRAFT_INSTANCES ]'}</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.addButtonText}>[+ NEW SERVER]</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={servers}
        renderItem={renderServerCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        refreshing={loading}
        onRefresh={fetchServers}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>{'> NO SERVERS FOUND'}</Text>
            <Text style={styles.emptySubtext}>INITIALIZE NEW INSTANCE</Text>
            <Text style={styles.emptyHint}>Google Colab • ngrok • FREE</Text>
          </View>
        }
      />

      {/* Create Server Modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>[INITIALIZE SERVER]</Text>
            
            <Text style={styles.modalHint}>
              Running on Google Colab • Tunneled via ngrok
            </Text>

            <TextInput
              style={styles.modalInput}
              placeholder="SERVER_NAME"
              placeholderTextColor={COLORS.textMuted}
              value={serverName}
              onChangeText={setServerName}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>[CANCEL]</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.createButton]}
                onPress={createServer}
              >
                <Text style={styles.createButtonText}>[CREATE]</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.darkBg,
  },
  header: {
    backgroundColor: COLORS.darkPanel,
    padding: SIZES.lg,
    paddingTop: SIZES.xl,
    borderBottomWidth: 2,
    borderBottomColor: COLORS.neonGreen,
  },
  headerTitle: {
    fontSize: SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.neonGreen,
    marginBottom: SIZES.md,
    fontFamily: 'monospace',
    letterSpacing: 1,
  },
  addButton: {
    backgroundColor: COLORS.darkInput,
    paddingVertical: SIZES.md,
    paddingHorizontal: SIZES.lg,
    borderRadius: 0,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.neonCyan,
    shadowColor: COLORS.neonCyan,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  addButtonText: {
    color: COLORS.neonCyan,
    fontWeight: 'bold',
    fontSize: SIZES.md,
    fontFamily: 'monospace',
    letterSpacing: 1,
  },
  listContent: {
    padding: SIZES.md,
  },
  serverCard: {
    backgroundColor: COLORS.darkPanel,
    borderRadius: 0,
    padding: SIZES.lg,
    marginBottom: SIZES.lg,
    borderWidth: 2,
    borderColor: COLORS.neonGreen,
    shadowColor: COLORS.neonGreen,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.md,
  },
  serverName: {
    fontSize: SIZES.md,
    fontWeight: 'bold',
    color: COLORS.neonGreen,
    flex: 1,
    fontFamily: 'monospace',
  },
  statusBadge: {
    paddingVertical: SIZES.xs,
    paddingHorizontal: SIZES.sm,
    borderRadius: 0,
    borderWidth: 1,
  },
  statusRunning: {
    backgroundColor: 'transparent',
    borderColor: COLORS.neonGreen,
  },
  statusStopped: {
    backgroundColor: 'transparent',
    borderColor: COLORS.neonOrange,
  },
  statusError: {
    backgroundColor: 'transparent',
    borderColor: COLORS.error,
  },
  statusText: {
    color: COLORS.neonGreen,
    fontSize: SIZES.sm,
    fontWeight: 'bold',
    fontFamily: 'monospace',
  },
  cardInfo: {
    fontSize: SIZES.sm,
    color: COLORS.neonCyan,
    marginBottom: SIZES.md,
    fontFamily: 'monospace',
  },
  copyButton: {
    backgroundColor: COLORS.darkInput,
    paddingVertical: SIZES.sm,
    borderRadius: 0,
    alignItems: 'center',
    marginBottom: SIZES.md,
    borderWidth: 1,
    borderColor: COLORS.neonCyan,
  },
  copyButtonText: {
    color: COLORS.neonCyan,
    fontWeight: '600',
    fontSize: SIZES.sm,
    fontFamily: 'monospace',
  },
  colabButton: {
    backgroundColor: COLORS.darkInput,
    paddingVertical: SIZES.md,
    borderRadius: 0,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.neonGreen,
    shadowColor: COLORS.neonGreen,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  colabButtonText: {
    color: COLORS.neonGreen,
    fontWeight: 'bold',
    fontSize: SIZES.md,
    fontFamily: 'monospace',
    letterSpacing: 1,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SIZES.xl * 2,
  },
  emptyText: {
    fontSize: SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.neonGreen,
    marginBottom: SIZES.sm,
    fontFamily: 'monospace',
  },
  emptySubtext: {
    fontSize: SIZES.md,
    color: COLORS.neonCyan,
    marginBottom: SIZES.md,
    fontFamily: 'monospace',
  },
  emptyHint: {
    fontSize: SIZES.sm,
    color: COLORS.textDim,
    fontFamily: 'monospace',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: COLORS.darkPanel,
    borderRadius: 0,
    padding: SIZES.lg,
    width: '85%',
    borderWidth: 2,
    borderColor: COLORS.neonGreen,
    shadowColor: COLORS.neonGreen,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 15,
    elevation: 5,
  },
  modalTitle: {
    fontSize: SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.neonGreen,
    marginBottom: SIZES.md,
    fontFamily: 'monospace',
    letterSpacing: 1,
  },
  modalHint: {
    fontSize: SIZES.sm,
    color: COLORS.neonCyan,
    marginBottom: SIZES.lg,
    fontFamily: 'monospace',
    opacity: 0.8,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: COLORS.neonGreen,
    backgroundColor: COLORS.darkInput,
    paddingHorizontal: SIZES.md,
    paddingVertical: SIZES.md,
    marginBottom: SIZES.lg,
    fontSize: SIZES.md,
    color: COLORS.textBright,
    fontFamily: 'monospace',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: SIZES.md,
  },
  modalButton: {
    paddingVertical: SIZES.md,
    paddingHorizontal: SIZES.lg,
    borderRadius: 0,
    minWidth: 100,
    alignItems: 'center',
    borderWidth: 1,
  },
  cancelButton: {
    backgroundColor: COLORS.darkInput,
    borderColor: COLORS.textDim,
  },
  cancelButtonText: {
    fontWeight: '600',
    fontSize: SIZES.md,
    color: COLORS.textDim,
    fontFamily: 'monospace',
  },
  createButton: {
    backgroundColor: COLORS.darkInput,
    borderColor: COLORS.neonGreen,
    shadowColor: COLORS.neonGreen,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  createButtonText: {
    fontWeight: '600',
    fontSize: SIZES.md,
    color: COLORS.neonGreen,
    fontFamily: 'monospace',
  },
});