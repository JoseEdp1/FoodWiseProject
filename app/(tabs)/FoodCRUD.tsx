// FoodCRUD.tsx
// CRUD completo de alimentos com dropdown funcional
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Modal,
  StyleSheet,
  Alert,
  StatusBar,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

type FoodCategory = 
  | 'carne' 
  | 'fruta' 
  | 'vegetal' 
  | 'fruto-do-mar' 
  | 'massas' 
  | 'doce' 
  | 'laticinio' 
  | 'condimentos'
  | 'graos'
  | 'bebidas'
  | 'ovos'
  | 'outros';

interface Food {
  id: number;
  name: string;
  category: FoodCategory;
  storage: 'geladeira' | 'freezer' | 'despensa';
  manufacturingDate: string;
  expirationDate: string;
}

interface FormData {
  name: string;
  category: FoodCategory;
  storage: 'geladeira' | 'freezer' | 'despensa';
  manufacturingDate: string;
  expirationDate: string;
}

const STORAGE_KEY = '@foods_database';

export default function FoodCRUD() {
  const [foods, setFoods] = useState<Food[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingFood, setEditingFood] = useState<Food | null>(null);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    category: 'outros',
    storage: 'geladeira',
    manufacturingDate: '',
    expirationDate: '',
  });
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState<boolean>(false);

  const categories: FoodCategory[] = [
    'carne', 'fruta', 'vegetal', 'fruto-do-mar', 'massas', 'doce',
    'laticinio', 'condimentos', 'graos', 'bebidas', 'ovos', 'outros'
  ];

  useEffect(() => {
    loadFoods();
  }, []);

  const loadFoods = async (): Promise<void> => {
    try {
      const storedFoods = await AsyncStorage.getItem(STORAGE_KEY);
      if (storedFoods) {
        setFoods(JSON.parse(storedFoods));
      } else {
        const initialFoods: Food[] = [
          { id: 1, name: 'Leite', category: 'laticinio', storage: 'geladeira',
            manufacturingDate: '2024-11-10', expirationDate: '2024-11-20' },
          { id: 2, name: 'Pão de Forma', category: 'massas', storage: 'despensa',
            manufacturingDate: '2024-11-15', expirationDate: '2024-11-25' },
        ];
        setFoods(initialFoods);
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(initialFoods));
      }
    } catch (error) {
      console.error('Erro ao carregar:', error);
      Alert.alert('Erro', 'Não foi possível carregar os dados');
    }
  };

  const saveFoods = async (updatedFoods: Food[]): Promise<void> => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedFoods));
      setFoods(updatedFoods);
    } catch (error) {
      console.error('Erro ao salvar:', error);
      Alert.alert('Erro', 'Não foi possível salvar os dados');
    }
  };

  const getCategoryIcon = (category: string): string => {
    const icons: Record<string, string> = {
      'carne': '🥩', 'fruta': '🍎', 'vegetal': '🥬', 'fruto-do-mar': '🦐',
      'massas': '🍝', 'doce': '🍰', 'laticinio': '🥛', 'condimentos': '🧂',
      'graos': '🌾', 'bebidas': '🥤', 'ovos': '🥚', 'outros': '📦'
    };
    return icons[category] || '📦';
  };

  const getCategoryName = (category: string): string => {
    const names: Record<string, string> = {
      'carne': 'Carne', 'fruta': 'Fruta', 'vegetal': 'Vegetal',
      'fruto-do-mar': 'Fruto do Mar', 'massas': 'Massas', 'doce': 'Doce',
      'laticinio': 'Laticínio', 'condimentos': 'Condimentos', 'graos': 'Grãos',
      'bebidas': 'Bebidas', 'ovos': 'Ovos', 'outros': 'Outros'
    };
    return names[category] || category;
  };

  const getStorageIcon = (storage: string): string => {
    const icons: Record<string, string> = {
      'geladeira': '🧊', 'freezer': '❄️', 'despensa': '🗄️'
    };
    return icons[storage] || '📦';
  };

  const getStorageName = (storage: string): string => {
    const names: Record<string, string> = {
      'geladeira': 'Geladeira', 'freezer': 'Freezer', 'despensa': 'Despensa'
    };
    return names[storage] || storage;
  };

  const calculateDaysRemaining = (expirationDate: string): number => {
    const today = new Date();
    const expiration = new Date(expirationDate);
    const diffTime = expiration.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getStatusColor = (daysRemaining: number): string => {
    if (daysRemaining < 0) return '#ef4444';
    if (daysRemaining <= 3) return '#f59e0b';
    return '#10b981';
  };

  const getStatusText = (daysRemaining: number): string => {
    if (daysRemaining < 0) return 'VENCIDO';
    if (daysRemaining === 0) return 'Vence HOJE';
    if (daysRemaining === 1) return 'Vence amanhã';
    return `${daysRemaining} dias restantes`;
  };

  const formatDate = (dateString: string): string => {
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
  };

  const openModal = (food: Food | null = null): void => {
    if (food) {
      setEditingFood(food);
      setFormData({
        name: food.name,
        category: food.category,
        storage: food.storage,
        manufacturingDate: food.manufacturingDate,
        expirationDate: food.expirationDate,
      });
    } else {
      setEditingFood(null);
      setFormData({
        name: '', category: 'outros', storage: 'geladeira',
        manufacturingDate: '', expirationDate: ''
      });
    }
    setIsModalOpen(true);
    setIsCategoryDropdownOpen(false);
  };

  const closeModal = (): void => {
    setIsModalOpen(false);
    setEditingFood(null);
    setIsCategoryDropdownOpen(false);
    setFormData({
      name: '', category: 'outros', storage: 'geladeira',
      manufacturingDate: '', expirationDate: ''
    });
  };

  const handleSubmit = async (): Promise<void> => {
    if (!formData.name || !formData.manufacturingDate || !formData.expirationDate) {
      Alert.alert('Atenção', 'Preencha todos os campos');
      return;
    }

    const manufacturing = new Date(formData.manufacturingDate);
    const expiration = new Date(formData.expirationDate);
    
    if (expiration <= manufacturing) {
      Alert.alert('Erro', 'A data de validade deve ser posterior à fabricação');
      return;
    }

    let updatedFoods: Food[];

    if (editingFood) {
      updatedFoods = foods.map((f) =>
        f.id === editingFood.id ? { ...f, ...formData } : f
      );
    } else {
      const newFood: Food = {
        id: foods.length > 0 ? Math.max(...foods.map((f) => f.id)) + 1 : 1,
        ...formData
      };
      updatedFoods = [...foods, newFood];
    }

    await saveFoods(updatedFoods);
    closeModal();
  };

  const handleDelete = (id: number): void => {
    Alert.alert(
      'Confirmar exclusão',
      'Tem certeza que deseja excluir este alimento?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            const updatedFoods = foods.filter((f) => f.id !== id);
            await saveFoods(updatedFoods);
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🍎 Controle de Validade</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => openModal()}>
          <Text style={styles.addButtonText}>+ Adicionar</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {foods.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📦</Text>
            <Text style={styles.emptyTitle}>Nenhum alimento cadastrado</Text>
            <Text style={styles.emptySubtitle}>Clique em Adicionar para começar</Text>
          </View>
        ) : (
          foods.map((food) => {
            const daysRemaining = calculateDaysRemaining(food.expirationDate);
            const statusColor = getStatusColor(daysRemaining);
            const statusText = getStatusText(daysRemaining);

            return (
              <View key={food.id} style={styles.foodCard}>
                <View style={styles.foodInfo}>
                  <Text style={styles.foodName}>{food.name}</Text>
                  
                  <View style={styles.infoRow}>
                    <View style={styles.categoryBadge}>
                      <Text style={styles.categoryText}>
                        {getCategoryIcon(food.category)} {getCategoryName(food.category)}
                      </Text>
                    </View>
                    <View style={styles.storageBadge}>
                      <Text style={styles.storageText}>
                        {getStorageIcon(food.storage)} {getStorageName(food.storage)}
                      </Text>
                    </View>
                  </View>
                  
                  <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
                    <Text style={styles.statusText}>{statusText}</Text>
                  </View>
                  
                  <View style={styles.datesContainer}>
                    <Text style={styles.dateLabel}>
                      📅 Fabricação: <Text style={styles.dateValue}>{formatDate(food.manufacturingDate)}</Text>
                    </Text>
                    <Text style={styles.dateLabel}>
                      ⏰ Validade: <Text style={styles.dateValue}>{formatDate(food.expirationDate)}</Text>
                    </Text>
                  </View>
                </View>
                
                <View style={styles.foodActions}>
                  <TouchableOpacity style={styles.editButton} onPress={() => openModal(food)}>
                    <Text style={styles.actionIcon}>✏️</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(food.id)}>
                    <Text style={styles.actionIcon}>🗑️</Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })
        )}
      </ScrollView>

      <Modal visible={isModalOpen} animationType="slide" transparent={true} onRequestClose={closeModal}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editingFood ? '✏️ Editar Alimento' : '➕ Novo Alimento'}
              </Text>
              <TouchableOpacity onPress={closeModal}>
                <Text style={styles.closeButton}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.formScrollView}>
              <View style={styles.formContainer}>
                <View style={styles.formGroup}>
                  <Text style={styles.label}>Nome do Alimento</Text>
                  <TextInput
                    style={styles.input}
                    value={formData.name}
                    onChangeText={(value) => setFormData({ ...formData, name: value })}
                    placeholder="Ex: Leite Integral"
                    placeholderTextColor="#999"
                  />
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.label}>Categoria</Text>
                  
                  <TouchableOpacity
                    style={styles.categorySelector}
                    onPress={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
                  >
                    <Text style={styles.categorySelectorText}>
                      {getCategoryIcon(formData.category)} {getCategoryName(formData.category)}
                    </Text>
                    <Text style={styles.dropdownArrow}>
                      {isCategoryDropdownOpen ? '▲' : '▼'}
                    </Text>
                  </TouchableOpacity>

                  {isCategoryDropdownOpen && (
                    <View style={styles.categoryDropdownList}>
                      {categories.map((cat) => (
                        <TouchableOpacity
                          key={cat}
                          style={[
                            styles.categoryOption,
                            formData.category === cat && styles.categoryOptionActive
                          ]}
                          onPress={() => {
                            setFormData({ ...formData, category: cat });
                            setIsCategoryDropdownOpen(false);
                          }}
                        >
                          <Text style={[
                            styles.categoryOptionText,
                            formData.category === cat && styles.categoryOptionTextActive
                          ]}>
                            {getCategoryIcon(cat)} {getCategoryName(cat)}
                          </Text>
                          {formData.category === cat && (
                            <Text style={styles.checkmark}>✓</Text>
                          )}
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.label}>Local de Armazenamento</Text>
                  <View style={styles.dropdownContainer}>
                    <TouchableOpacity
                      style={[
                        styles.dropdownOption,
                        formData.storage === 'geladeira' && styles.dropdownOptionActive
                      ]}
                      onPress={() => setFormData({ ...formData, storage: 'geladeira' })}
                    >
                      <Text style={[
                        styles.dropdownOptionText,
                        formData.storage === 'geladeira' && styles.dropdownOptionTextActive
                      ]}>
                        🧊 Geladeira
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[
                        styles.dropdownOption,
                        formData.storage === 'freezer' && styles.dropdownOptionActive
                      ]}
                      onPress={() => setFormData({ ...formData, storage: 'freezer' })}
                    >
                      <Text style={[
                        styles.dropdownOptionText,
                        formData.storage === 'freezer' && styles.dropdownOptionTextActive
                      ]}>
                        ❄️ Freezer
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[
                        styles.dropdownOption,
                        formData.storage === 'despensa' && styles.dropdownOptionActive
                      ]}
                      onPress={() => setFormData({ ...formData, storage: 'despensa' })}
                    >
                      <Text style={[
                        styles.dropdownOptionText,
                        formData.storage === 'despensa' && styles.dropdownOptionTextActive
                      ]}>
                        🗄️ Despensa
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.label}>Data de Fabricação</Text>
                  <TextInput
                    style={styles.input}
                    value={formData.manufacturingDate}
                    onChangeText={(value) => setFormData({ ...formData, manufacturingDate: value })}
                    placeholder="AAAA-MM-DD (Ex: 2024-11-10)"
                    placeholderTextColor="#999"
                  />
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.label}>Data de Validade</Text>
                  <TextInput
                    style={styles.input}
                    value={formData.expirationDate}
                    onChangeText={(value) => setFormData({ ...formData, expirationDate: value })}
                    placeholder="AAAA-MM-DD (Ex: 2024-11-25)"
                    placeholderTextColor="#999"
                  />
                </View>

                <View style={styles.modalActions}>
                  <TouchableOpacity style={styles.cancelButton} onPress={closeModal}>
                    <Text style={styles.cancelButtonText}>Cancelar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.saveButton} onPress={handleSubmit}>
                    <Text style={styles.saveButtonText}>💾 Salvar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: {
    backgroundColor: '#fff', paddingTop: 50, paddingBottom: 20, paddingHorizontal: 20,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1, shadowRadius: 4, elevation: 3,
  },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: '#1f2937' },
  addButton: { backgroundColor: '#3b82f6', paddingVertical: 10, paddingHorizontal: 18, borderRadius: 10 },
  addButtonText: { color: '#fff', fontSize: 15, fontWeight: '600' },
  scrollView: { flex: 1 },
  scrollContent: { padding: 16 },
  emptyContainer: { alignItems: 'center', justifyContent: 'center', paddingVertical: 80 },
  emptyIcon: { fontSize: 64, marginBottom: 16 },
  emptyTitle: { fontSize: 18, fontWeight: '600', color: '#6b7280', marginBottom: 8 },
  emptySubtitle: { fontSize: 14, color: '#9ca3af' },
  foodCard: {
    backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 12,
    flexDirection: 'row', shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1, shadowRadius: 3, elevation: 2,
  },
  foodInfo: { flex: 1 },
  foodName: { fontSize: 18, fontWeight: '700', color: '#1f2937', marginBottom: 4 },
  infoRow: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 8, marginBottom: 10 },
  categoryBadge: { backgroundColor: '#fef3c7', paddingVertical: 4, paddingHorizontal: 10, borderRadius: 12 },
  categoryText: { fontSize: 12, color: '#92400e', fontWeight: '600' },
  storageBadge: { backgroundColor: '#dbeafe', paddingVertical: 4, paddingHorizontal: 10, borderRadius: 12 },
  storageText: { fontSize: 12, color: '#1e40af', fontWeight: '600' },
  statusBadge: { alignSelf: 'flex-start', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 20, marginBottom: 10 },
  statusText: { color: '#fff', fontSize: 12, fontWeight: '700', textTransform: 'uppercase' },
  datesContainer: { gap: 4 },
  dateLabel: { fontSize: 13, color: '#6b7280' },
  dateValue: { fontWeight: '600', color: '#1f2937' },
  foodActions: { justifyContent: 'center', gap: 8, marginLeft: 12 },
  editButton: { backgroundColor: '#eff6ff', width: 44, height: 44, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  deleteButton: { backgroundColor: '#fef2f2', width: 44, height: 44, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  actionIcon: { fontSize: 20 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  modalContent: { backgroundColor: '#fff', borderRadius: 20, width: '100%', maxWidth: 400, maxHeight: '85%', padding: 24 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: '#1f2937' },
  closeButton: { fontSize: 28, color: '#6b7280', fontWeight: '300' },
  formScrollView: { flex: 1 },
  formContainer: { gap: 18, paddingBottom: 20 },
  formGroup: { gap: 8 },
  label: { fontSize: 14, fontWeight: '600', color: '#374151' },
  input: {
    backgroundColor: '#f9fafb', borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 10,
    paddingVertical: 12, paddingHorizontal: 16, fontSize: 15, color: '#1f2937',
  },
  categorySelector: {
    backgroundColor: '#f9fafb', borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 10,
    paddingVertical: 12, paddingHorizontal: 16, flexDirection: 'row',
    justifyContent: 'space-between', alignItems: 'center',
  },
  categorySelectorText: { fontSize: 15, color: '#1f2937', fontWeight: '500' },
  dropdownArrow: { fontSize: 12, color: '#6b7280' },
  categoryDropdownList: {
    backgroundColor: '#fff', borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 10,
    marginTop: 8, maxHeight: 200, shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15, shadowRadius: 4, elevation: 5,
  },
  categoryOption: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingVertical: 14, paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: '#f3f4f6',
  },
  categoryOptionActive: { backgroundColor: '#fef3c7' },
  categoryOptionText: { fontSize: 15, color: '#374151' },
  categoryOptionTextActive: { color: '#92400e', fontWeight: '600' },
  checkmark: { fontSize: 16, color: '#92400e', fontWeight: 'bold' },
  dropdownContainer: { flexDirection: 'row', gap: 8 },
  dropdownOption: {
    flex: 1, backgroundColor: '#f9fafb', borderWidth: 1, borderColor: '#e5e7eb',
    borderRadius: 10, paddingVertical: 12, alignItems: 'center', justifyContent: 'center',
  },
  dropdownOptionActive: { backgroundColor: '#dbeafe', borderColor: '#3b82f6', borderWidth: 2 },
  dropdownOptionText: { fontSize: 13, color: '#6b7280', fontWeight: '500' },
  dropdownOptionTextActive: { color: '#1e40af', fontWeight: '700' },
  modalActions: { flexDirection: 'row', gap: 12, marginTop: 8 },
  cancelButton: { flex: 1, backgroundColor: '#f3f4f6', paddingVertical: 14, borderRadius: 10, alignItems: 'center' },
  cancelButtonText: { color: '#4b5563', fontSize: 16, fontWeight: '600' },
  saveButton: { flex: 1, backgroundColor: '#3b82f6', paddingVertical: 14, borderRadius: 10, alignItems: 'center' },
  saveButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});