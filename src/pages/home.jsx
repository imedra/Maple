import axios from 'axios';
import React, { useState, useEffect } from 'react';
import Barcode from 'react-barcode';
// import AsyncStorage from '@react-native-async-storage/async-storage';
import cheerio from 'cheerio';
import {
  Page,
  Navbar,
  NavTitle,
  NavTitleLarge,
  NavRight,
  Link,
  Block,
  BlockTitle,
  List,
  ListItem,
  Card,
  CardContent,
  CardFooter,
  Icon,
  Popup,
  f7,
  BlockFooter,
} from 'framework7-react';
export default ({ f7router }) => {
    const [profile, setProfile] = useState('');
    const [recent, setRecent] = useState([]);
    const [popupOpened, setPopupOpened] = useState(false);

    useEffect(async () => {
        try {
        //  let username = await AsyncStorage.getItem('username');
        //  let password = await AsyncStorage.getItem('password');
                try { 
                    loadProfile();            
                } catch(ex) {
                f7.dialog.alert(`Data refresh failed. Try restarting the application.`);
                }
            }
            catch(ex) {
            f7.dialog.alert(`Data refresh failed. Try restarting the application.`);
        }
    }, []);
    const loadProfile = async (/* username, password */) => {
        const profileRequest = await axios({method: 'get', headers: { "Content-Type": 'application/json' }, url: '/aspen/portalStudentDetail.do?navkey=myInfo.details.detail'});
        const profileToken = await profileRequest.data.match(/name="org.apache.struts.taglib.html.TOKEN" value="(.*?)"/)[1]

        let $ = cheerio.load(profileRequest.data);
        let profileData = {firstname: '', lastname: '', school: '', grade: ''}
        profileData.name = $('span[id="propertyValue(relStdPsnOid_psnNameFirst)-span"]').text() + ' ' + $('span[id="propertyValue(relStdPsnOid_psnNameLast)-span"]').text();
        profileData.school = $('span[id="propertyValue(relStdSklOid_sklSchoolName)-span"]').text();
        profileData.grade = $('span[id="propertyValue(stdGradeLevel)-span"]').text();
        profileData.id = $('span[id="propertyValue(stdIDLocal)-span"]').text();

        const profileForm = new FormData();
        profileForm.append('userEvent', 2030);
        profileForm.append('userParam', 3);
        profileForm.append('deploymentId', 'aspen');
        profileForm.append('org.apache.struts.taglib.html.TOKEN', profileToken);
        const photoRequest = await axios({method: 'post', url: '/aspen/portalStudentDetail.do', data: profileForm, withCredentials: true});
        $ = cheerio.load(photoRequest.data);
        profileData.photo = '/aspen/' + $('span[id="propertyValue(relStdPsnOid_psnPhoOIDPrim)-span"] > img').attr('src');

        setProfile(profileData);
        loadRecent();
    }; 
    
    const loadRecent = async () => {
        const recentList = [];
        const getRecentList = await axios({method: 'get', headers: { "Content-Type": 'application/xml' }, url: '/aspen/studentRecentActivityWidget.do?preferences=%3C%3Fxml%20version%3D%221.0%22%20encoding%3D%22UTF-8%22%3F%3E%3Cpreference-set%3E%0A%20%20%3Cpref%20id%3D%22dateRange%22%20type%3D%22int%22%3E4%3C%2Fpref%3E%0A%3C%2Fpreference-set%3E'});
        console.log(getRecentList);
        const $ = cheerio.load(getRecentList.data, { xmlMode: true });
        $('recent-activity').children().each((index, element) => {
            recentList.push({
                type: element['name'],          
                attributes: element['grade']
            });
            setRecent(recent);
          });
    };

    return(
        <Page>
            {/* Virtual ID */}
            <Popup
                className="vid"
                opened={popupOpened}
                onPopupClosed={() => setPopupOpened(false)}
            >
                <Page noSwipeback>
                    <Navbar title="Virtual ID">
                        <NavRight>
                            <Link popupClose>Close</Link>
                        </NavRight>
                    </Navbar>
                <Block>
                <BlockTitle large>{profile.name}</BlockTitle>
                <BlockFooter>ID: {profile.id}</BlockFooter>
                <BlockFooter>School: {profile.school}</BlockFooter>
                <BlockFooter>Grade: {profile.grade}</BlockFooter>
                <img
                    slot="media"
                    src={profile.photo}
                    width="200"
                    />
                <Barcode height={48} value={profile.id} format='CODE39'/>
                </Block>
                </Page>
            </Popup>
            {/* Top Navbar */}
            <Navbar large sliding={false}>
            <NavTitleLarge>Home</NavTitleLarge>
            </Navbar>
            {/* Page content */}
            <BlockTitle>Your Profile</BlockTitle>
            <Card>
            <CardContent padding={false}>
                <List medial-list>
                <ListItem link='/home/' onClick={() => setPopupOpened(true)} title='View Virtual ID'>
                    <img
                    slot="media"
                    src={profile.photo}
                    width="44"
                    />
                </ListItem>
                </List>
            </CardContent>
            <CardFooter>
                <span>Name: {profile.name}</span>
                <span>ID: {profile.id}</span>
            </CardFooter>
            </Card>
            <BlockTitle>Quick Access</BlockTitle>
            <List>
            <ListItem link="/about/" title="View CTA Data">
                <Icon md="f7:car_fill" aurora="f7:car_fill" ios="f7:car_fill" slot="media"/>
            </ListItem>
            <ListItem link="/about/" title="View Recent Activity">
                <Icon md="f7:list_bullet" aurora="f7:list_bullet" ios="f7:list_bullet" slot="media"/>
            </ListItem>
            <ListItem link="/about/" title="View Schedule">
                <Icon md="f7:calendar" aurora="f7:calendar" ios="f7:calendar" slot="media"/>
            </ListItem>
            <ListItem link="/about/" title="View Annoucements">
                <Icon md="f7:bubble_left_bubble_right_fill" aurora="f7:bubble_left_bubble_right_fill" ios="f7:bubble_left_bubble_right_fill" slot="media"/>
            </ListItem>
            </List>
        </Page>
);
}