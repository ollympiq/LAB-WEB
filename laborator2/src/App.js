import React, { useState } from 'react';
import { Button, Form, Input, Layout, Menu, Select } from 'antd';
import { makeAutoObservable } from 'mobx';
import { observer } from 'mobx-react';

const { Item: MenuItem } = Menu;
const { Header, Content, Footer } = Layout;
const { Option } = Select;

class Store {
    items = new Array(3).fill(null).map((_, index) => ({
        key: (index + 1).toString(),
        NrCard: generateRandomCardNumber(),
        NumberOfCard: `Card ${index + 1}`,
        DateOfExpire: generateRandomDateOfExpire(),
        NameOfOwner: romanianNames[Math.floor(Math.random() * romanianNames.length)],
        CVC: generateRandomCVC(),
        color: generateRandomColor(),
        bank: generateRandomBank(),
    }));

    users = [
        { username: 'user1', password: 'password1' },
        { username: 'user2', password: 'password2' },
        
    ];

    constructor() {
        makeAutoObservable(this);
        this.initializeData();
        this.initializeUsers();
    }

    saveDataToLocalStorage = (key, data) => {
        localStorage.setItem(key, JSON.stringify(data));
    };

    getDataFromLocalStorage = (key) => {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    };

    initializeData = () => {
        const storedData = this.getDataFromLocalStorage('items');
        if (!storedData) {
            this.saveDataToLocalStorage('items', this.items);
        }
    };

    initializeUsers = () => {
        const storedUsers = this.getDataFromLocalStorage('users');
        if (!storedUsers) {
            this.saveDataToLocalStorage('users', this.users);
        }
    };

    updateItem = (key, data) => {
        const storedData = this.getDataFromLocalStorage('items');
        const updatedData = storedData.map(item => (item.key === key ? { ...item, ...data } : item));
        this.saveDataToLocalStorage('items', updatedData);
    };

    checkCredentials = (username, password) => {
        return this.users.some(user => user.username === username && user.password === password);
    };
}

const generateRandomCardNumber = () => {
    const generatePart = () => Math.floor(1000 + Math.random() * 9000);
    return `${generatePart()} ${generatePart()} ${generatePart()} ${generatePart()}`;
};

const generateRandomDateOfExpire = () => {
    const generateMonth = () => String(Math.floor(Math.random() * 12) + 1).padStart(2, '0');
    const generateYear = () => String(Math.floor(Math.random() * 10) + 22);
    return `${generateMonth()}/${generateYear()}`;
};

const generateRandomCVC = () => String(Math.floor(100 + Math.random() * 900));

const romanianNames = ['Andrei Popescu', 'Maria Ionescu', 'Ion Vasilescu', 'Elena Dumitrescu', 'Alexandru Radulescu', 'Ana Stanciu', 'Mihai Stefanescu', 'Cristina Stan', 'George Nicolescu', 'Laura Ungureanu'];

const generateRandomBank = () => {
    const banks = ['MAIB', 'Gringotts', 'MICB'];
    return banks[Math.floor(Math.random() * banks.length)];
};

const generateRandomColor = () => {
    const colors = ['blue', 'red', 'green', 'yellow'];
    return colors[Math.floor(Math.random() * colors.length)];
};

const store = new Store();

const CustomForm = observer(() => {
    const [formSubmitted, setFormSubmitted] = useState(false);
    const [formData, setFormData] = useState(null);
    const [selectedItem, setSelectedItem] = useState('1');

    const onFinish = (values) => {
        setFormSubmitted(true);
        setFormData(values);
        store.updateItem(selectedItem, values);

        console.log('Formular trimis cu valorile:', values);
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
            <Form onFinish={onFinish} style={{ width: '400px' }}>
                <Form.Item
                    label="Număr card"
                    name="cardNumber"
                    pattern="^[0-9]{4} [0-9]{4} [0-9]{4} [0-9]{4}$"
                    rules={[{ required: true, message: 'Vă rugăm să introduceți numărul cardului' }]}
                >
                    <Input placeholder="Introduceți numărul cardului" />
                </Form.Item>
                <Form.Item
                    label="Data expirării"
                    name="expiryDate"
                    pattern="^(0[1-9]|1[0-2])\/[0-9]{2}$"
                    rules={[{ required: true, message: 'Vă rugăm să introduceți data expirării' }]}
                >
                    <Input placeholder="Introduceți data expirării" />
                </Form.Item>
                <Form.Item
                    label="CVC"
                    name="cvc"
                    rules={[
                        { required: true, message: 'Vă rugăm să introduceți CVC-ul' },
                        { validator: validateCVC },
                    ]}
                >
                    <Input placeholder="Introduceți CVC-ul" />
                </Form.Item>
                <Form.Item
                    label="Culoare"
                    name="color"
                    rules={[{ required: true, message: 'Vă rugăm să introduceți culoarea' }]}
                >
                    <Input placeholder="Introduceți culoarea" />
                </Form.Item>
                <Form.Item
                    label="Bank"
                    name="bank"
                    rules={[{ required: true, message: 'Vă rugăm să introduceți banca' }]}
                >
                    <Select placeholder="Selectează bancă">
                        <Option value="Example Bank 1">MAIB</Option>
                        <Option value="Example Bank 2">Gringotts</Option>
                        <Option value="Example Bank 3">MICB</Option>
                    </Select>
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
                        Trimite
                    </Button>
                </Form.Item>
            </Form>
            {formSubmitted && (
                <div>
                    <h2>Datele formularului:</h2>
                    <p>Număr card: {formData.cardNumber}</p>
                    <p>Data expirării: {formData.expiryDate}</p>
                    <p>CVC: {formData.cvc}</p>
                    <p>Culoare: {formData.color}</p>
                    <p>Bank: {formData.bank}</p>
                </div>
            )}
        </div>
    );
});
const LoginForm = observer(() => {
    const [formSubmitted, setFormSubmitted] = useState(false);
    const [formData, setFormData] = useState(null);
    const [loginError, setLoginError] = useState(false);

    const onFinish = (values) => {
        setFormSubmitted(true);
        setFormData(values);
        const { username, password } = values;
        const isAuthenticated = store.checkCredentials(username, password);

        if (isAuthenticated) {
            setLoginError(false);
            console.log('Autentificare reușită pentru utilizatorul:', username);

            return;
        }

        setLoginError(true);
        console.log('Autentificare eșuată pentru utilizatorul:', username);
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
            <Form onFinish={onFinish} style={{ width: '400px' }}>
                <Form.Item
                    label="Nume utilizator"
                    name="username"
                    rules={[{ required: true, message: 'Vă rugăm să introduceți numele de utilizator' }]}
                >
                    <Input placeholder="Introduceți numele de utilizator" />
                </Form.Item>
                <Form.Item
                    label="Parolă"
                    name="password"
                    rules={[{ required: true, message: 'Vă rugăm să introduceți parola' }]}
                >
                    <Input.Password placeholder="Introduceți parola" />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
                        Autentificare
                    </Button>
                </Form.Item>
                {formSubmitted && loginError && <p style={{ color: 'red' }}>Nume de utilizator sau parolă incorecte</p>}
                {formSubmitted && !loginError && <p style={{ color: 'green' }}>Autentificare reușită!</p>}
            </Form>
        </div>
    );
});
const validateCVC = (_, value) => {
    if (!value) {
        return Promise.reject('Vă rugăm să introduceți CVC-ul');
    }
    if (!/^\d{3}$/.test(value)) {
        return Promise.reject('Vă rugăm să introduceți un CVC valid (3 cifre)');
    }
    return Promise.resolve();
};

const fetchDataWithLoading = async () => {
    await new Promise(resolve => setTimeout(resolve, 2000));
    const storedData = store.getDataFromLocalStorage('items');
    if (storedData) {
        store.items = storedData;
    }
};

fetchDataWithLoading();

const App = observer(() => {
    const [selectedItem, setSelectedItem] = useState('1');
    const [currentRoute, setCurrentRoute] = useState('cards');

    const handleMenuItemClick = (item) => {
        setSelectedItem(item.key);
        setCurrentRoute(item.key);
    };
    const showUsersDataFromLocalStorage = () => {
        const userData = localStorage.getItem('users');
        console.log('Datele de autentificare din localStorage:', userData);
    };
    const showLocalStorageData = () => {
        const data = localStorage.getItem('items');
        console.log('Datele din localStorage:', data);
    };

    const selectedCard = store.items.find((item) => item.key === selectedItem);

    return (
        <Layout>
            <Header style={{ display: 'flex', alignItems: 'center' }}>
                <div className="demo-logo" />
                <Menu
                    theme="dark"
                    mode="horizontal"
                    defaultSelectedKeys={['1']}
                    selectedKeys={[selectedItem]}
                    onClick={handleMenuItemClick}
                    style={{ flex: 1, minWidth: 0 }}
                >
                    {store.items.map(item => (
                        <MenuItem key={item.key}>{item.NumberOfCard}</MenuItem>
                    ))}
                    <MenuItem key="form">Formular</MenuItem>
                    <MenuItem key="login">Autentificare</MenuItem>
                </Menu>
                <Button onClick={showLocalStorageData} style={{ marginLeft: '16px' }}>Card-localStorage</Button>
                <Button onClick={showUsersDataFromLocalStorage}>Autentificare-localStorage</Button>
            </Header>
            <Content style={{ padding: '0 48px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <div
                    style={{
                        background: '#fff',
                        width: '60%',
                        padding: '24px',
                        borderRadius: '5px',
                        textAlign: 'center',
                    }}
                >
                    {currentRoute === 'form' ? <CustomForm /> : (
                        currentRoute === 'login' ? <LoginForm /> : (
                            <>
                                <h2 style={{ fontSize: '24px', marginBottom: '12px' }}>Cardul {selectedCard?.NrCard}</h2>
                                <p style={{ fontSize: '20px', marginBottom: '8px' }}>Numele proprietarului: {selectedCard?.NameOfOwner}</p>
                                <p style={{ fontSize: '20px', marginBottom: '8px' }}>Data expirării: {selectedCard?.DateOfExpire}</p>
                                <p style={{ fontSize: '20px', marginBottom: '8px' }}>CVC: {selectedCard?.CVC}</p>
                                <p style={{ fontSize: '20px', marginBottom: '8px' }}>Culoare: {selectedCard?.color}</p>
                                <p style={{ fontSize: '20px', marginBottom: '8px' }}>Bank: {selectedCard?.bank}</p>
                            </>
                        )
                    )}
                </div>
            </Content>
            <Footer style={{ textAlign: 'center' }}>
                Ant Design ©{new Date().getFullYear()} Creat de Ant UED
            </Footer>
        </Layout>
    );
});

export default App;