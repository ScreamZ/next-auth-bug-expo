import { SafeAreaView, StyleSheet, Button } from 'react-native';
import setCookie from 'set-cookie-parser';

const basePath = 'https://www.supafriends.com/auth';

const loginTest = async () => {
  // Fetch CSRF
  const csrfResponse = await fetch(`${basePath}/csrf`, {
    method: 'GET',
    credentials: 'omit',
  });

  const combinedCookieHeader = csrfResponse.headers.get('Set-Cookie') ?? '';
  const splitCookieHeaders = setCookie.splitCookiesString(combinedCookieHeader);
  const cookies = setCookie.parse(splitCookieHeaders);

  console.log('GET csrf Set-Cookie Header:', combinedCookieHeader);

  const data = await csrfResponse.json();
  console.log('Get csrf Response content:', data);

  const body: Record<string, string> = { csrfToken: data.csrfToken };

  const formBody = Object.keys(body)
    .map((key) => encodeURIComponent(key) + '=' + encodeURIComponent(body[key]))
    .join('&');

  const Cookie = cookies.map((c) => `${c.name}=${c.value}`).join('; ');

  const headers = {
    'X-Auth-Return-Redirect': 'true', // require otherwise we are redirected (bad named header, but the lib only check for "has" on it)
    'Content-Type': 'application/x-www-form-urlencoded',
    Cookie,
  };
  console.log('Header for SignInRequest', headers);
  console.log('Body for SignInRequest', formBody);

  const signInResponse = await fetch(`${basePath}/signin/discord`, {
    method: 'POST',
    credentials: 'include',
    headers,
    body: formBody,
  })
    .then((res) => res.json())
    .catch((e) => console.error('SignInRequest Error', e));

  console.log(signInResponse);
};

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <Button
        onPress={() => {
          loginTest();
        }}
        title="Try request (Check console before clicking, and try two time)"
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 8,
  },
});
