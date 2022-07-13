import DisTube from 'distube';

export default (distube: DisTube) => {
  distube.on('error', (channel, err) => {
    console.error(err);
  });
};
