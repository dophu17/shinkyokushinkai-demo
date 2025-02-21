import { Box, Paper, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import './CompetePage.css';

const BracketLine = styled('div', {
  shouldForwardProp: prop => prop !== 'isWinner'
})(({ theme, isWinner }) => ({
  width: '30px',
  height: '2px',
  backgroundColor: isWinner ? theme.palette.primary.main : '#ccc',
  position: 'absolute',
}));

const TeamBox = styled(Paper, {
  shouldForwardProp: prop => prop !== 'isWinner'
})(({ theme, isWinner }) => ({
  padding: theme.spacing(1),
  width: '150px',
  height: '40px',
  textAlign: 'center',
  border: isWinner ? `2px solid ${theme.palette.primary.main}` : '1px solid #ccc',
  backgroundColor: '#fff',
}));

const CompetePage = () => {
  const teams = {
    quarterFinals: [
      { name: 'Team 1', isWinner: true },
      { name: 'Team 2', isWinner: false },
      { name: 'Team 3', isWinner: true },
      { name: 'Team 4', isWinner: false },
      { name: 'Team 5', isWinner: true },
      { name: 'Team 6', isWinner: false },
      { name: 'Team 7', isWinner: false },
      { name: 'Team 8', isWinner: true },
    ],
    semiFinals: [
      { name: 'Team 1', isWinner: true },
      { name: 'Team 3', isWinner: false },
      { name: 'Team 5', isWinner: true },
      { name: 'Team 8', isWinner: false },
    ],
    final: [
      { name: 'Team 1', isWinner: true },
      { name: 'Team 5', isWinner: false },
    ],
    champion: { name: 'Team 1' }
  };

  return (
    <Box sx={{ p: 4, position: 'relative' }}>
      <Typography variant="h4" sx={{ mb: 4, textAlign: 'center' }}>
        Tournament Bracket
      </Typography>
      
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 8 }}>
        {/* Left Branch */}
        <Box sx={{ display: 'flex', gap: 4, position: 'relative', mr: 5 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4, position: 'relative' }}>
            {teams.quarterFinals.slice(0, 4).map((team, index) => (
              <Box 
                className={`team-box-${index + 1}`} 
                key={index} 
                sx={{ position: 'relative', mb: index % 2 === 0 ? 3 : 0 }}
              >
                <TeamBox isWinner={team.isWinner}>
                  {team.name}
                </TeamBox>
                {index % 2 === 0 && (
                  <>
                    <BracketLine 
                      isWinner={team.isWinner}
                      sx={{ right: '-32px', top: '20px' }}
                    />
                    <BracketLine 
                      isWinner={teams.quarterFinals[index + 1].isWinner}
                      sx={{ right: '-32px', top: '108px' }}
                    />
                    <BracketLine 
                      isWinner={teams.semiFinals[Math.floor(index/2)].isWinner}
                      sx={{ 
                        right: '-32px',
                        top: '20px',
                        height: '88px',
                        width: '2px'
                      }}
                    />
                    {/* Semi-finals to Finals connection */}
                    {index === 0 && (
                      <>
                        <BracketLine 
                          isWinner={teams.semiFinals[0].isWinner}
                          sx={{ 
                            right: '-64px', 
                            top: '64px',
                            width: '32px'
                          }}
                        />
                        <BracketLine 
                          isWinner={teams.semiFinals[1].isWinner}
                          sx={{ 
                            right: '-64px', 
                            top: '240px',
                            width: '32px'
                          }}
                        />
                        <BracketLine 
                          isWinner={teams.final[0].isWinner}
                          sx={{ 
                            right: '-64px',
                            top: '64px',
                            height: '176px',
                            width: '2px'
                          }}
                        />
                        <BracketLine 
                          isWinner={teams.final[0].isWinner}
                          sx={{ 
                            right: '-129px',
                            top: '152px',
                            width: '67px'
                          }}
                        />
                      </>
                    )}
                  </>
                )}
              </Box>
            ))}
          </Box>
        </Box>

        {/* Champion */}
        <Box sx={{ alignSelf: 'flex-start', mx: 4, mt: 16.5 }}>
          <TeamBox sx={{ backgroundColor: 'gold !important', position: 'relative', zIndex: 1 }}>
            {teams.champion.name}
          </TeamBox>
        </Box>

        {/* Right Branch */}
        <Box sx={{ display: 'flex', gap: 4, flexDirection: 'row-reverse', position: 'relative', ml: 5 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4, position: 'relative' }}>
            {teams.quarterFinals.slice(4, 8).map((team, index) => (
              <Box 
                className={`team-box-${index + 5}`} 
                key={index} 
                sx={{ position: 'relative', mb: index % 2 === 0 ? 3 : 0 }}
              >
                <TeamBox isWinner={team.isWinner}>
                  {team.name}
                </TeamBox>
                {index % 2 === 0 && (
                  <>
                    <BracketLine 
                      isWinner={team.isWinner}
                      sx={{ left: '-32px', top: '20px' }}
                    />
                    <BracketLine 
                      isWinner={teams.quarterFinals[index + 5].isWinner}
                      sx={{ left: '-32px', top: '108px' }}
                    />
                    <BracketLine 
                      isWinner={teams.semiFinals[Math.floor(index/2) + 2].isWinner}
                      sx={{ 
                        left: '-32px',
                        top: '20px',
                        height: '88px',
                        width: '2px'
                      }}
                    />
                    {/* Semi-finals to Finals connection */}
                    {index === 0 && (
                      <>
                        <BracketLine 
                          isWinner={teams.semiFinals[2].isWinner}
                          sx={{ 
                            left: '-64px', 
                            top: '64px',
                            width: '32px'
                          }}
                        />
                        <BracketLine 
                          isWinner={teams.semiFinals[3].isWinner}
                          sx={{ 
                            left: '-64px', 
                            top: '240px',
                            width: '32px'
                          }}
                        />
                        <BracketLine 
                          isWinner={teams.final[1].isWinner}
                          sx={{ 
                            left: '-64px',
                            top: '64px',
                            height: '176px',
                            width: '2px'
                          }}
                        />
                        <BracketLine 
                          isWinner={teams.final[1].isWinner}
                          sx={{ 
                            left: '-129px',
                            top: '152px',
                            width: '67px'
                          }}
                        />
                      </>
                    )}
                  </>
                )}
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default CompetePage;
