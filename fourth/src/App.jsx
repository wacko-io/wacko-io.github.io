import React from 'react'
import {
    Layout, Menu, Row, Col, Card, Space, Typography, Form, Input,
    Radio, Select, DatePicker, Checkbox, Button
} from 'antd'

const { Header, Content, Footer } = Layout
const { Title, Paragraph, Link: A } = Typography

export default function App() {
    const menuItems = [
        { label: <a href="https://apple.com/">Ссылка меню 1</a> },
        { label: <a href="https://tesla.com">Ссылка 2</a> },
        { label: <a href="https://sony.com">Ссылка 3</a> },
    ]

    return (
        <Layout>
            <Header>
                <nav aria-label="Главное меню" className="header-nav">
                    <Card size="small" className="header-logo" aria-label="Лого">
                        Лого
                    </Card>
                    <div className="header-content">
                        <Title level={1} className="header-title">Название сайта</Title>
                        <Menu
                            mode="horizontal"
                            theme="light"
                            disabledOverflow
                            items={menuItems}
                            style={{ background: 'transparent', border: 'none', padding: 0 }}
                        />
                    </div>
                </nav>
            </Header>

            <Content>
                <Row gutter={[16, 16]} justify="center">
                    <Col xs={24} md={22} lg={20}>
                        <Card id="links" title="Список гиперссылок" style={{ scrollMarginTop: 80 }}>
                            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                                <ul>
                                    <li><A href="http://kubsu.ru">абсолютная ссылка на kubsu.ru (http)</A></li>
                                    <li><A href="https://kubsu.ru">абсолютная ссылка на kubsu.ru (https)</A></li>
                                    <li><a href="https://kubsu.ru"><img src="../public/img.png" alt="kubsu" /></a></li>
                                    <li><A href="/contacts.html">сокращённая ссылка на внутреннюю страницу</A></li>
                                    <li><A href="/">сокращённая ссылка на главную страницу</A></li>
                                    <li><A href="#frag">ссылка на фрагмент текущей страницы</A></li>
                                    <li><A href="https://kubsu.ru/search?q=html&lang=ru&page=1">ссылка с тремя параметрами</A></li>
                                    <li><A href="https://kubsu.ru/?id=123">ссылка с параметром id</A></li>
                                    <li><A href="./page.html">относительная ссылка (текущий каталог)</A></li>
                                    <li><A href="about/index.html">относительная ссылка (каталог about)</A></li>
                                    <li><A href="../index.html">относительная ссылка уровнем выше</A></li>
                                    <li><A href="../../index.html">относительная двумя уровнями выше</A></li>

                                    <li>
                                        контекстная ссылка в тексте:
                                        <Paragraph style={{ margin: 0 }}>
                                            Читайте <A href="https://developer.mozilla.org/ru/docs/Web/HTML">документацию HTML</A>.
                                        </Paragraph>
                                    </li>

                                    <li><A href="https://ru.wikipedia.org/wiki/HTML#История">ссылка на фрагмент стороннего сайта</A></li>

                                    <li>
                                        ссылки из областей картинки (map):<br />
                                        <img src="../public/map.svg" alt="карта изображения" width="320" height="160" useMap="#m" />
                                        <map name="m">
                                            <area shape="rect" coords="20,20,140,80" href="https://kubsu.ru" alt="Переход на kubsu.ru" />
                                            <area shape="circle" coords="230,80,36" href="https://developer.mozilla.org/" alt="Переход на MDN" />
                                        </map>
                                    </li>

                                    <li><A href="#">ссылка с пустым href</A></li>
                                    <li><a>ссылка без href</a></li>
                                    <li><A href="https://example.com" rel="nofollow">nofollow ссылка</A></li>
                                    <li><A href="https://example.com/secret" rel="noindex">noindex ссылка</A></li>

                                    <li>
                                        нумерованный список ссылок с title:
                                        <ol>
                                            <li><A href="https://html.spec.whatwg.org/" title="Спецификация HTML">HTML Spec</A></li>
                                            <li><A href="https://validator.w3.org/" title="Проверка разметки">W3C Validator</A></li>
                                            <li><A href="https://kubsu.ru/" title="КУБГУ">kubsu.ru</A></li>
                                        </ol>
                                    </li>

                                    <li>
                                        <A href="ftp://user:password@ftp.example.com/readme.txt">
                                            ссылка на FTP-файл с авторизацией
                                        </A>
                                    </li>
                                </ul>
                            </Space>
                        </Card>

                        <Card id="table" title="Таблица" style={{ marginTop: 16, scrollMarginTop: 80 }}>
                            <div role="table" aria-label="Демонстрационная таблица">
                                <table className="data-table">
                                    <thead>
                                    <tr>
                                        <th>Колонка 1</th>
                                        <th>Колонка 2</th>
                                        <th>Колонка 3</th>
                                        <th>Колонка 4</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    <tr>
                                        <td colSpan="3">Ячейка 11-12-13</td>
                                        <td rowSpan="2">Ячейка 14</td>
                                    </tr>
                                    <tr>
                                        <td>Ячейка 21</td>
                                        <td>Ячейка 22</td>
                                        <td>Ячейка 23</td>
                                    </tr>
                                    <tr>
                                        <td rowSpan="2" colSpan="2">Ячейка 31-32,41-42</td>
                                        <td colSpan="2">Ячейка 32-34</td>
                                    </tr>
                                    <tr>
                                        <td>Ячейка 43</td>
                                        <td>Ячейка 44</td>
                                    </tr>
                                    <tr>
                                        <td>Ячейка 51</td>
                                        <td>Ячейка 52</td>
                                        <td>Ячейка 53</td>
                                        <td>Ячейка 54</td>
                                    </tr>
                                    <tr>
                                        <td>Ячейка 61</td>
                                        <td>Ячейка 62</td>
                                        <td>Ячейка 63</td>
                                        <td>Ячейка 64</td>
                                    </tr>
                                    </tbody>
                                </table>
                            </div>
                        </Card>

                        <Card id="form" title="Форма" style={{ marginTop: 16, scrollMarginTop: 80 }}>
                            <Form layout="vertical" name="task3-form" onFinish={(values) => console.log(values)} requiredMark>
                                <Form.Item label="ФИО" name="fio" rules={[{ required: true }]}>
                                    <Input />
                                </Form.Item>

                                <Form.Item label="Телефон" name="phone" rules={[{ required: true }]}>
                                    <Input type="tel" />
                                </Form.Item>

                                <Form.Item label="E-mail" name="email" rules={[{ type: 'email', required: true }]}>
                                    <Input />
                                </Form.Item>

                                <Form.Item label="Дата рождения" name="date" rules={[{ required: true }]}>
                                    <DatePicker style={{ width: '100%' }} />
                                </Form.Item>

                                <Form.Item label="Пол" name="sex" rules={[{ required: true }]}>
                                    <Radio.Group>
                                        <Radio value="male">Мужской</Radio>
                                        <Radio value="female">Женский</Radio>
                                    </Radio.Group>
                                </Form.Item>

                                <Form.Item
                                    label="Любимый язык программирования"
                                    name="lang"
                                    rules={[{ required: true, message: 'Выберите язык(и)' }]}>
                                    <Select mode="multiple" placeholder="Выбери один или несколько">
                                        {['Pascal','C','C++','JavaScript','PHP','Python','Java','Haskell','Clojure','Prolog','Scala']
                                            .map(l => <Select.Option key={l} value={l}>{l}</Select.Option>)}
                                    </Select>
                                </Form.Item>

                                <Form.Item label="Биография" name="bio">
                                    <Input.TextArea rows={3} />
                                </Form.Item>

                                <Form.Item
                                    name="contract"
                                    valuePropName="checked"
                                    rules={[{ validator:(_,v)=> v ? Promise.resolve() : Promise.reject(new Error('Нужно согласие')) }]}>
                                    <Checkbox>с контрактом ознакомлен(а)</Checkbox>
                                </Form.Item>

                                <Form.Item>
                                    <Button type="primary" htmlType="submit">Сохранить</Button>
                                </Form.Item>
                            </Form>
                        </Card>
                    </Col>
                </Row>
            </Content>

            <Footer>© Дмитрий Матвеев</Footer>
        </Layout>
    )
}