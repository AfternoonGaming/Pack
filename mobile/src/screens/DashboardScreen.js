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
    // Refresh every 10 seconds
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
      
      const { server, colab_url } = response.data;
      
      setServerName('');
      setModalVisible(false);
      
      // Show instructions and open Colab
      Alert.alert(
        'Server Created!',
        'Click "Open Colab" to start your server. You\'ll need your free ngrok token from https://dashboard.ngrok.com/auth',
        [
          { text: 'Cancel', onPress: () => {} },
          { 
            text: 'Open Colab', 
            onPress: () => {
              Linking.openURL(colab_url);
            }
          }
        ]
      );
      
      fetchServers();
    } catch (error) {
      Alert.alert('Error', 'Failed to create server: ' + error.message);
    }
  };

  const openColabNotebook = (colabUrl) => {
    Linking.openURL(colabUrl);
  };

  const renderServerCard = ({ item }) => (
    <View style={styles.serverCard}>
      <View style={styles.cardHeader}>
        <Text style={styles.serverName}>{item.server_name}</Text>
        <View style={[
          styles.statusBadge, 
          item.status === 'running' ? styles.statusRunning : 
          item.status === 'stopped' ? styles.statusStopped :
          styles.statusError
        ]}>
          <Text style={styles.statusText}>{item.status.toUpperCase()}</Text>
        </View>
      </View>

      {item.ip_address ? (
        <>
          <Text style={styles.cardInfo}>🎮 Connection: {item.ip_address}</Text>
          <TouchableOpacity 
            style={styles.copyButton}
            onPress={() => {
              Alert.alert('Copied!', `Share this with friends: ${item.ip_address}`);
            }}
          >
            <Text style={styles.copyButtonText}>📋 Copy Address</Text>
          </TouchableOpacity>
        </>
      ) : (
        <Text style={styles.cardInfo}>Port: {item.port}</Text>
      )}

      <TouchableOpacity
        style={styles.colabButton}
        onPress={() => openColabNotebook(item.colab_url)}
      >
        <Text style={styles.colabButtonText}>🚀 Open Colab Notebook</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🎮 Your Servers</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.addButtonText}>+ New Server</Text>
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
            <Text style={styles.emptyText}>No servers yet</Text>
            <Text style={styles.emptySubtext}>Create one to get started!</Text>
            <Text style={styles.emptyHint}>Runs on free Google Colab 🎉</Text>
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
            <Text style={styles.modalTitle}>Create New Server</Text>
            
            <Text style={styles.modalHint}>
              Server will run on Google Colab (free) with ngrok tunneling
            </Text>

            <TextInput
              style={styles.modalInput}
              placeholder="Server Name (e.g., Survival SMP)"
              placeholderTextColor={COLORS.mutedText}
              value={serverName}
              onChangeText={setServerName}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.createButton]}
                onPress={createServer}
              >
                <Text style={styles.modalButtonText}>Create</Text>
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
    backgroundColor: COLORS.background,
  },
  header: {
    backgroundColor: COLORS.primary,
    padding: SIZES.lg,
    paddingTop: SIZES.xl,
  },
  headerTitle: {
    fontSize: SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.lightText,
    marginBottom: SIZES.md,
  },
  addButton: {
    backgroundColor: COLORS.success,
    paddingVertical: SIZES.md,
    paddingHorizontal: SIZES.lg,
    borderRadius: 6,
    alignItems: 'center',
  },
  addButtonText: {
    color: COLORS.lightText,
    fontWeight: 'bold',
    fontSize: SIZES.md,
  },
  listContent: {
    padding: SIZES.md,
  },
  serverCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 8,
    padding: SIZES.lg,
    marginBottom: SIZES.lg,
    elevation: 2,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
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
    color: COLORS.text,
    flex: 1,
  },
  statusBadge: {
    paddingVertical: SIZES.xs,
    paddingHorizontal: SIZES.sm,
    borderRadius: 4,
  },
  statusRunning: {
    backgroundColor: COLORS.success,
  },
  statusStopped: {
    backgroundColor: COLORS.warning,
  },
  statusError: {
    backgroundColor: COLORS.error,
  },
  statusText: {
    color: COLORS.lightText,
    fontSize: SIZES.sm,
    fontWeight: 'bold',
  },
  cardInfo: {
    fontSize: SIZES.sm,
    color: COLORS.mutedText,
    marginBottom: SIZES.md,
  },
  copyButton: {
    backgroundColor: COLORS.info,
    paddingVertical: SIZES.sm,
    borderRadius: 6,
    alignItems: 'center',
    marginBottom: SIZES.md,
  },
  copyButtonText: {
    color: COLORS.lightText,
    fontWeight: '600',
    fontSize: SIZES.sm,
  },
  colabButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: SIZES.md,
    borderRadius: 6,
    alignItems: 'center',
  },
  colabButtonText: {
    color: COLORS.lightText,
    fontWeight: 'bold',
    fontSize: SIZES.md,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SIZES.xl * 2,
  },
  emptyText: {
    fontSize: SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SIZES.sm,
  },
  emptySubtext: {
    fontSize: SIZES.md,
    color: COLORS.mutedText,
    marginBottom: SIZES.md,
  },
  emptyHint: {
    fontSize: SIZES.sm,
    color: COLORS.success,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: SIZES.lg,
    width: '85%',
    elevation: 5,
  },
  modalTitle: {
    fontSize: SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SIZES.md,
  },
  modalHint: {
    fontSize: SIZES.sm,
    color: COLORS.mutedText,
    marginBottom: SIZES.lg,
    fontStyle: 'italic',
  },
  modalInput: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 6,
    paddingHorizontal: SIZES.md,
    paddingVertical: SIZES.sm,
    marginBottom: SIZES.lg,
    fontSize: SIZES.md,
    color: COLORS.text,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: SIZES.md,
  },
  modalButton: {
    paddingVertical: SIZES.md,
    paddingHorizontal: SIZES.lg,
    borderRadius: 6,
    minWidth: 100,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: COLORS.border,
  },
  createButton: {
    backgroundColor: COLORS.primary,
  },
  modalButtonText: {
    fontWeight: '600',
    fontSize: SIZES.md,
    color: COLORS.text,
  },
});