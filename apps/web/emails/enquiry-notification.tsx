import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
} from '@react-email/components';

export function EnquiryNotificationEmail(props: {
  fullName: string;
  email: string;
  destination?: string;
  notes?: string;
}) {
  return (
    <Html>
      <Head />
      <Preview>New journey enquiry from {props.fullName}</Preview>
      <Body style={{ backgroundColor: '#0c0c0c', color: '#ffffff', fontFamily: 'sans-serif' }}>
        <Container style={{ padding: '32px' }}>
          <Heading style={{ color: '#c5a059' }}>New enquiry</Heading>
          <Text>Name: {props.fullName}</Text>
          <Text>Email: {props.email}</Text>
          <Text>Destination: {props.destination ?? '—'}</Text>
          <Text>Notes: {props.notes ?? '—'}</Text>
        </Container>
      </Body>
    </Html>
  );
}

export default EnquiryNotificationEmail;
