import { Card, Input } from 'antd';

const { Meta } = Card;

function VideoCard({ video, title, value, onChange, ...props }) {
  return (
    <Card hoverable cover={video} {...props}>
      {title && <Meta title={title} style={{ textAlign: 'center' }} />}
      {!title && (
        <>
          <p>
            <b>¿Qué seña es esta?</b>
          </p>
          <Input value={value} onChange={onChange} />
        </>
      )}
    </Card>
  );
}

export default VideoCard;
