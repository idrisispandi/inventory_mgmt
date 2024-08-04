'use client'

import { useState, useEffect } from 'react';
import { Box, Stack, Typography, Button, Modal, TextField } from '@mui/material';
import { firestore } from '@/firebase';
import {
  collection,
  doc,
  getDocs,
  setDoc,
  deleteDoc,
  getDoc,
} from 'firebase/firestore';
import './globals.css'; 

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'white',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  display: 'flex',
  flexDirection: 'column',
  gap: 3,
};

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState('');
  const [bulkItems, setBulkItems] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const updateInventory = async () => {
    try {
      const snapshot = await getDocs(collection(firestore, 'inventory'));
      const inventoryList = snapshot.docs.map(doc => ({
        name: doc.id, 
        ...doc.data()
      }));
      setInventory(inventoryList);
    } catch (error) {
      console.error('Error fetching inventory:', error);
    }
  };

  const removeItem = async (itemName) => {
    const docRef = doc(firestore, 'inventory', itemName);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { count } = docSnap.data();
      if (count === 1) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, { count: count - 1 }, { merge: true });
      }
      updateInventory();
    }
  };

  const addItem = async (itemName) => {
    const docRef = doc(firestore, 'inventory', itemName);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { count } = docSnap.data();
      await setDoc(docRef, { count: count + 1 }, { merge: true });
    } else {
      await setDoc(docRef, { count: 1 });
    }
    updateInventory();
  };

  const addBulkItems = async (bulkItems) => {
    const items = bulkItems.split('\n').map(item => item.trim()).filter(item => item);
    for (let item of items) {
      await addItem(item);
    }
    setBulkItems('');
  };

  useEffect(() => {
    updateInventory();
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleAddItem = () => {
    if (itemName) {
      addItem(itemName);
      setItemName('');
      handleClose();
    }
  };

  const handleBulkAdd = () => {
    if (bulkItems) {
      addBulkItems(bulkItems);
      handleClose();
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAddItem();
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredInventory = inventory.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box className="background">
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Add Item
          </Typography>
          <Stack width="100%" direction={'row'} spacing={2}>
            <TextField
              id="outlined-basic"
              label="Item"
              variant="outlined"
              fullWidth
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <Button
              variant="outlined"
              onClick={handleAddItem}
            >
              Add
            </Button>
          </Stack>
          <Typography variant="h6" component="h2" mt={3}>
            Add Multiple Items
          </Typography>
          <TextField
            id="bulk-items"
            label="Enter items, one per line"
            variant="outlined"
            fullWidth
            multiline
            rows={4}
            value={bulkItems}
            onChange={(e) => setBulkItems(e.target.value)}
          />
          <Button
            variant="outlined"
            onClick={handleBulkAdd}
          >
            Add Bulk Items
          </Button>
        </Box>
      </Modal>
      <Stack width="800px" spacing={2}>
        <Button variant="contained" onClick={handleOpen}>
          Add New Item
        </Button>
        <TextField
          id="search"
          label="Search Inventory"
          variant="outlined"
          fullWidth
          value={searchQuery}
          onChange={handleSearchChange}
        />
        <Box border={'1px solid #333'}>
          <Box
            width="100%"
            height="100px"
            bgcolor={'#ADD8E6'}
            display={'flex'}
            justifyContent={'center'}
            alignItems={'center'}
          >
            <Typography variant={'h2'} color={'#333'} textAlign={'center'}>
              Inventory Items
            </Typography>
          </Box>
          <Stack width="100%" height="300px" spacing={2} overflow={'auto'}>
            {filteredInventory.map(({ name, count }) => (
              <Box
                key={name}
                width="100%"
                minHeight="150px"
                display={'flex'}
                justifyContent={'space-between'}
                alignItems={'center'}
                bgcolor={'#f0f0f0'}
                paddingX={5}
              >
                <Typography variant={'h3'} color={'#333'} textAlign={'center'}>
                  {name.charAt(0).toUpperCase() + name.slice(1)}
                </Typography>
                <Typography variant={'h3'} color={'#333'} textAlign={'center'}>
                  Quantity: {count}
                </Typography>
                <Button variant="contained" onClick={() => removeItem(name)}>
                  Remove
                </Button>
              </Box>
            ))}
          </Stack>
        </Box>
      </Stack>
    </Box>
  );
}
