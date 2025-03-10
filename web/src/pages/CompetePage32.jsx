import { Box, Paper, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tabs, Tab, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import './CompetePage.css';
import React from 'react';

const BracketLine = styled('div', {
  shouldForwardProp: prop => !['isWinner', 'points', 'typeLine', 'groupAlign', 'status'].includes(prop)
})(({ theme, isWinner, points, typeLine, groupAlign, status }) => ({
  width: '30px',
  height: '2px',
  backgroundColor: (isWinner && status !== 'fighting') ? theme.palette.primary.main : '#ccc',
  position: 'absolute',
  '&::after': (points || points === 0) ? {
    content: `"${points}"`,
    position: 'absolute',
    ...(typeLine === 'top' ? {
      left: groupAlign === 'left' ? '7px' : '-25px',
      top: '60%',
      transform: 'translateY(-50%)'
    } : typeLine === 'bottom' ? {
      top: '10px',
      right: groupAlign === 'left' ? '-10px' : '20px',
      transform: 'translateX(50%)'
    } : {
      left: groupAlign === 'left' ? '45px' : '10px',
      top: '-10px',
      transform: 'translateY(-50%)'
    }),
    fontSize: '0.8rem',
    fontWeight: 'bold',
    color: (isWinner && status !== 'fighting') ? theme.palette.primary.main : '#ccc'
  } : {}
}));

const TeamBox = styled(Paper, {
  shouldForwardProp: prop => !['isWinner', 'status'].includes(prop)
})(({ theme, isWinner, status }) => ({
  padding: theme.spacing(1),
  width: '150px',
  height: '40px',
  textAlign: 'center',
  border: (isWinner && status !== 'fighting') ? `2px solid ${theme.palette.primary.main}` : '1px solid #ccc',
  backgroundColor: '#fff',
}));

const emptyTeam = {
  name: 'Team empty', isWinner: false, points: 0, isEmptyTeam: true
};

// status: fighting/finished
// isWinner: true/false
// points: number/null
// branch: 1/2 (branch 1/branch 2)
// competitorId: id
const defaultTeams = [
  // Branch 1
  { id: 1, name: 'Team 1', isWinner: false, points: null, status: 'fighting', branch: 1, competitorId: 16 },
  { id: 2, name: 'Team 2', isWinner: false, points: null, status: 'fighting', branch: 1, competitorId: 15 },
  { id: 3, name: 'Team 3', isWinner: false, points: null, status: 'fighting', branch: 1, competitorId: 14 },
  { id: 4, name: 'Team 4', isWinner: false, points: null, status: 'fighting', branch: 1, competitorId: 13 },
  { id: 5, name: 'Team 5', isWinner: false, points: null, status: 'fighting', branch: 1, competitorId: 12 },
  { id: 6, name: 'Team 6', isWinner: false, points: null, status: 'fighting', branch: 1, competitorId: 11 },
  { id: 7, name: 'Team 7', isWinner: false, points: null, status: 'fighting', branch: 1, competitorId: 10 },
  { id: 8, name: 'Team 8', isWinner: false, points: null, status: 'fighting', branch: 1, competitorId: 9 },
  { id: 9, name: 'Team 9', isWinner: false, points: null, status: 'fighting', branch: 1, competitorId: 8 },
  { id: 10, name: 'Team 10', isWinner: false, points: null, status: 'fighting', branch: 1, competitorId: 7 },
  { id: 11, name: 'Team 11', isWinner: false, points: null, status: 'fighting', branch: 1, competitorId: 6 },
  { id: 12, name: 'Team 12', isWinner: false, points: null, status: 'fighting', branch: 1, competitorId: 5 },
  { id: 13, name: 'Team 13', isWinner: false, points: null, status: 'fighting', branch: 1, competitorId: 4 },
  { id: 14, name: 'Team 14', isWinner: false, points: null, status: 'fighting', branch: 1, competitorId: 3 },
  { id: 15, name: 'Team 15', isWinner: false, points: null, status: 'fighting', branch: 1, competitorId: 2 },
  { id: 16, name: 'Team 16', isWinner: false, points: null, status: 'fighting', branch: 1, competitorId: 1 },
  
  // Branch 2
  { id: 17, name: 'Team 17', isWinner: false, points: null, status: 'fighting', branch: 2, competitorId: 32 },
  { id: 18, name: 'Team 18', isWinner: false, points: null, status: 'fighting', branch: 2, competitorId: 31 },
  { id: 19, name: 'Team 19', isWinner: false, points: null, status: 'fighting', branch: 2, competitorId: 30 },
  { id: 20, name: 'Team 20', isWinner: false, points: null, status: 'fighting', branch: 2, competitorId: 29 },
  { id: 21, name: 'Team 21', isWinner: false, points: null, status: 'fighting', branch: 2, competitorId: 28 },
  { id: 22, name: 'Team 22', isWinner: false, points: null, status: 'fighting', branch: 2, competitorId: 27 },
  { id: 23, name: 'Team 23', isWinner: false, points: null, status: 'fighting', branch: 2, competitorId: 26 },
  { id: 24, name: 'Team 24', isWinner: false, points: null, status: 'fighting', branch: 2, competitorId: 25 },
  { id: 25, name: 'Team 25', isWinner: false, points: null, status: 'fighting', branch: 2, competitorId: 24 },
  { id: 26, name: 'Team 26', isWinner: false, points: null, status: 'fighting', branch: 2, competitorId: 23 },
  { id: 27, name: 'Team 27', isWinner: false, points: null, status: 'fighting', branch: 2, competitorId: 22 },
  { id: 28, name: 'Team 28', isWinner: false, points: null, status: 'fighting', branch: 2, competitorId: 21 },
  { id: 29, name: 'Team 29', isWinner: false, points: null, status: 'fighting', branch: 2, competitorId: 20 },
  { id: 30, name: 'Team 30', isWinner: false, points: null, status: 'fighting', branch: 2, competitorId: 19 },
  { id: 31, name: 'Team 31', isWinner: false, points: null, status: 'fighting', branch: 2, competitorId: 18 },
  { id: 32, name: 'Team 32', isWinner: false, points: null, status: 'fighting', branch: 2, competitorId: 17 },
];

const CompetePage = () => {
  // Hàm để đảm bảo mỗi cặp đấu có 1 đội thắng
  const ensureOneWinnerPerPair = (teams) => {
    for (let i = 0; i < teams.length; i += 2) {
      const team1 = teams[i];
      const team2 = teams[i + 1];
      
      // Đảm bảo cả hai đội tồn tại
      if (!team1 || !team2) {
        if (team1) {
          team1.isWinner = true;
        }
        if (team2) {
          team2.isWinner = true;
        }
        continue;
      }

      // So sánh điểm và xác định đội thắng
      if (team1.points > team2.points) {
        team1.isWinner = true;
        team2.isWinner = false;
      } else if (team1.points < team2.points) {
        team1.isWinner = false;
        team2.isWinner = true;
      } else {
        // Nếu điểm bằng nhau, chọn đội đầu tiên thắng
        team1.isWinner = true;
        team2.isWinner = false;
      }
    }
    return teams;
  };

  // Cập nhật hàm ensureEightTeams để tự thêm đội trống
  const ensureEightTeams = (teams) => {
    const filledTeams = [...teams];
    while (filledTeams.length < 8) {
      filledTeams.push({ ...emptyTeam, name: `Team empty ${filledTeams.length + 1}` });
    }
    return ensureOneWinnerPerPair(filledTeams);
  };

  // Add this new function
  const determineRandomWinners = (teams) => {
    const updatedTeams = teams.map(team => ({
      ...team,
      points: Math.floor(Math.random() * 10) + 1, // Random points between 1-10
      status: 'finished'
    }));
    return ensureOneWinnerPerPair(updatedTeams);
  };

  // Add new function to arrange teams based on id and competitorId
  const arrangeTeamsByCompetitor = (teams) => {
    const arrangedTeams = [];
    const processedIds = new Set();

    teams.forEach(team => {
      // Skip if this team has already been processed
      if (processedIds.has(team.id)) return;

      // Find the matching competitor
      const competitor = teams.find(t => t.id === team.competitorId);
      if (competitor) {
        arrangedTeams.push(team);
        arrangedTeams.push(competitor);
        processedIds.add(team.id);
        processedIds.add(competitor.id);
      }
    });

    return arrangedTeams;
  };

  // Update quarterFinalsTeams initialization
  const [quarterFinalsTeams, setQuarterFinalsTeams] = React.useState(() => 
    ensureEightTeams(arrangeTeamsByCompetitor(defaultTeams))
  );

  // Add states for tournament rounds
  const [semiFinals, setSemiFinals] = React.useState([]);
  const [final, setFinal] = React.useState([]);
  const [finalRound1, setFinalRound1] = React.useState([]);
  const [finalRound2, setFinalRound2] = React.useState([]);
  const [champion, setChampion] = React.useState({});

  // Add function to regenerate tournament results
  const regenerateTournament = () => {
    // First Round (32 teams -> 16 teams)
    const firstRoundTeams = determineRandomWinners(quarterFinalsTeams);
    setQuarterFinalsTeams(firstRoundTeams);

    // Second Round (16 teams -> 8 teams)
    const secondRoundTeams = determineRandomWinners(
      firstRoundTeams
        .filter(team => team.isWinner && team.status === 'finished')
        .map(team => ({
          name: team.name,
          isWinner: false,
          points: null,
          status: 'fighting'
        }))
    );
    setSemiFinals(secondRoundTeams);

    // Quarter Finals (8 teams -> 4 teams)
    const quarterFinalTeams = determineRandomWinners(
      secondRoundTeams
        .filter(team => team.isWinner && team.status === 'finished')
        .map(team => ({
          name: team.name,
          isWinner: false,
          points: null,
          status: 'fighting'
        }))
    );
    setFinal(quarterFinalTeams);

    // Semi Finals (4 teams -> 2 teams)
    const semiFinalTeams = determineRandomWinners(
      quarterFinalTeams
        .filter(team => team.isWinner && team.status === 'finished')
        .map(team => ({
          name: team.name,
          isWinner: false,
          points: null,
          status: 'fighting'
        }))
    );

    // Finals (2 teams -> 1 champion)
    const finalTeams = determineRandomWinners(
      semiFinalTeams
        .filter(team => team.isWinner && team.status === 'finished')
        .map(team => ({
          name: team.name,
          isWinner: false,
          points: null,
          status: 'fighting'
        }))
    );
    setFinalRound1(semiFinalTeams)
    setFinalRound2(finalTeams)
    console.log('finalRound1', semiFinalTeams)
    console.log('finalRound2', finalTeams)

    // Set champion
    const winner = finalTeams.find(team => team.isWinner) || {};
    setChampion({
      ...winner,
      status: 'champion'
    });
  };

  // Add useEffect to automatically run tournament when page loads
  React.useEffect(() => {
    // Short delay to ensure UI is ready
    const timer = setTimeout(() => {
      regenerateTournament();
    }, 500);

    return () => clearTimeout(timer);
  }, []); // Empty dependency array means this runs once on mount

  // Update teams object to use state values
  const teams = {
    quarterFinals: quarterFinalsTeams,
    semiFinals,
    final,
    champion,
    finalRound1,
    finalRound2
  };

  const quarterFinalsLeft = teams.quarterFinals.filter(item => item.branch === 1);
  const quarterFinalsRight = teams.quarterFinals.filter(item => item.branch === 2);
  const [selectedRound, setSelectedRound] = React.useState('round1');

  const handleRoundChange = (event, newValue) => {
    setSelectedRound(newValue);
  };

  const getRoundTeams = () => {
    switch (selectedRound) {
      case 'round1':
        return teams.quarterFinals;
      case 'round2':
        return teams.quarterFinals
          .filter(team => team.isWinner && team.status === 'finished')
          .map(team => ({
            ...team,
            status: team.status === 'fighting' ? 'fighting' : 'finished'
          }));
      case 'quarterFinals':
        return teams.semiFinals;
      case 'semiFinals':
        return teams.final;
      case 'final':
        return teams.finalRound1;
      case 'finalRound1':
        return teams.finalRound2
          .map(team => ({
            ...team,
            status: team.status === 'fighting' ? 'fighting' : 'finished'
          }));
      case 'champion':
        return [teams.champion];
      default:
        return teams.quarterFinals;
    }
  };

  return (
    <Box sx={{ p: 4, position: 'relative' }}>
      {/* Control buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2, gap: 2, flexWrap: 'wrap' }}>
        <Button 
          variant="contained" 
          onClick={regenerateTournament}
          sx={{ mb: 2 }}
        >
          Regenerate Tournament Results
        </Button>
      </Box>

      <Box className="tournament-bracket-container" sx={{ overflowX: 'auto' }}>
        <Typography variant="h4" sx={{ mb: 4, textAlign: 'center' }}>
          Tournament Bracket - 32 Teams
        </Typography>
        
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          gap: 8, 
          minWidth: '1400px', // Ensure minimum width for readability
          p: 4
        }}>
          {/* Left Branch */}
          <Box sx={{ display: 'flex', gap: 8, position: 'relative', paddingLeft: '1100px' }}>
            {/* First Round - 8 matches */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, paddingLeft: '20px' }}>
              {Array.from({ length: 16 }, (_, i) => i).map((index) => (
                <Box 
                  key={index} 
                  sx={{ 
                    position: 'relative', 
                    mb: index % 2 === 0 ? 4 : 8 // Increased spacing between match pairs
                  }}
                >
                  <TeamBox 
                    isWinner={quarterFinalsLeft[index]?.isWinner} 
                    status={quarterFinalsLeft[index]?.status}
                  >
                    {quarterFinalsLeft[index]?.name || ''}
                  </TeamBox>
                  {index % 2 === 0 && (
                    <BracketLine 
                      isWinner={true}
                      status={quarterFinalsLeft[index]?.status}
                      sx={{ 
                        right: '-32px',
                        top: '20px',
                        width: '32px'
                      }}
                      className={`bracket-line-horizontal-level-1-team-box-${index + 1}`}
                    />
                  )}
                  {index % 2 === 0 && (
                    <BracketLine 
                      isWinner={true}
                      status={quarterFinalsLeft[index]?.status}
                      sx={{ 
                        right: '-32px',
                        top: '102px',
                        width: '32px'
                      }}
                      className={`bracket-line-horizontal-level-1-team-box-${index + 1}`}
                    />
                  )}
                  {index % 2 === 0 && (
                    <BracketLine 
                      isWinner={quarterFinalsLeft[index]?.isWinner}
                      status={quarterFinalsLeft[index]?.status}
                      points={quarterFinalsLeft[index]?.points}
                      typeLine="top"
                      groupAlign="left"
                      sx={{ 
                        right: '-32px',
                        top: '20px',
                        height: '42px', // Increased height for larger bracket
                        width: '2px'
                      }}
                      className={`bracket-line-vertical-level-1-team-box-${index + 1}-top`}
                    />
                  )}
                  {index % 2 === 0 && (
                    <BracketLine 
                      isWinner={quarterFinalsLeft[index + 1]?.isWinner}
                      status={quarterFinalsLeft[index + 1]?.status}
                      points={quarterFinalsLeft[index + 1]?.points}
                      typeLine="bottom"
                      groupAlign="left"
                      sx={{ 
                        right: '-32px',
                        top: '62px',
                        height: '42px', // Increased height for larger bracket
                        width: '2px'
                      }}
                      className={`bracket-line-vertical-level-1-team-box-${index + 1}-bottom`}
                    />
                  )}
                  {index % 2 === 0 && (
                    <BracketLine 
                      isWinner={true}
                      status={quarterFinalsLeft[index]?.status}
                      sx={{ 
                        right: '-64px',
                        top: '62px',
                        width: '32px'
                      }}
                      className='bracket-line-horizontal-level-2-team-box-1'
                    />
                  )}
                </Box>
              ))}
            </Box>

            {/* Second Round - 4 matches */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 6 }}>
              {Array.from({ length: 8 }, (_, i) => i).map((index) => (
                <Box 
                  key={index} 
                  sx={{ 
                    position: 'relative', 
                    mb: index % 2 === 0 ? 19 : 19 // Increased spacing
                  }}
                >
                  <TeamBox 
                    isWinner={teams.semiFinals[index]?.isWinner} 
                    status={teams.semiFinals[index]?.status}
                  >
                    {teams.semiFinals[index]?.name || ''}
                  </TeamBox>
                  {index % 2 === 0 && (
                    <>
                      <BracketLine 
                        isWinner={true}
                        status={teams.semiFinals[index]?.status}
                        sx={{ 
                          right: '-32px',
                          top: '20px',
                          width: '32px'
                        }}
                        className={`bracket-line-horizontal-level-3-team-box-${index + 1}`}
                      />
                      <BracketLine 
                        isWinner={true}
                        status={teams.semiFinals[index]?.status}
                        sx={{ 
                          right: '-32px',
                          top: '228px',
                          width: '32px'
                        }}
                        className={`bracket-line-horizontal-level-3-team-box-${index + 1}`}
                      />
                      <BracketLine 
                        isWinner={teams.semiFinals[index]?.isWinner}
                        status={teams.semiFinals[index]?.status}
                        points={teams.semiFinals[index]?.points}
                        typeLine="top"
                        groupAlign="left"
                        sx={{ 
                          right: '-32px',
                          top: '20px',
                          height: '104px', // Increased height
                          width: '2px'
                        }}
                        className={`bracket-line-vertical-level-2-team-box-${index + 1}-top`}
                      />
                      <BracketLine 
                        isWinner={teams.semiFinals[index + 1]?.isWinner}
                        status={teams.semiFinals[index + 1]?.status}
                        points={teams.semiFinals[index + 1]?.points}
                        typeLine="top"
                        groupAlign="left"
                        sx={{ 
                          right: '-32px',
                          top: '124px',
                          height: '104px', // Increased height
                          width: '2px'
                        }}
                        className={`bracket-line-vertical-level-2-team-box-${index + 1}-bottom`}
                      />
                      <BracketLine 
                        isWinner={true}
                        status={teams.semiFinals[index]?.status}
                        sx={{ 
                          right: '-64px',
                          top: '124px',
                          width: '32px'
                        }}
                        className={`bracket-line-horizontal-level-4-team-box-${index + 1}`}
                      />
                    </>
                  )}
                </Box>
              ))}
            </Box>

            {/* Quarter Finals - 2 matches */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 19 }}>
              {Array.from({ length: 4 }, (_, i) => i).map((index) => (
                <Box 
                  key={index} 
                  sx={{ 
                    position: 'relative', 
                    mb: index % 2 === 0 ? 45 : 45 // Increased spacing
                  }}
                >
                  <TeamBox 
                    isWinner={teams.final[index]?.isWinner} 
                    status={teams.final[index]?.status}
                  >
                    {teams.final[index]?.name || ''}
                  </TeamBox>
                  {index % 2 === 0 && (
                    <>
                      <BracketLine 
                        isWinner={true}
                        status={teams.final[index]?.status}
                        sx={{ 
                          right: '-32px',
                          top: '20px',
                          width: '32px'
                        }}
                        className={`bracket-line-horizontal-level-5-team-box-${index + 1}`}
                      />
                      <BracketLine 
                        isWinner={true}
                        status={teams.final[index]?.status}
                        sx={{ 
                          right: '-32px',
                          top: '434px',
                          width: '32px'
                        }}
                        className={`bracket-line-horizontal-level-5-team-box-${index + 1}`}
                      />
                      <BracketLine 
                        isWinner={teams.final[index]?.isWinner}
                        status={teams.final[index]?.status}
                        points={teams.final[index]?.points}
                        typeLine="top"
                        groupAlign="left"
                        sx={{ 
                          right: '-32px',
                          top: '20px',
                          height: '207px', // Increased height
                          width: '2px'
                        }}
                        className={`bracket-line-vertical-level-3-team-box-${index + 1}-top`}
                      />
                      <BracketLine 
                        isWinner={teams.final[index + 1]?.isWinner}
                        status={teams.final[index + 1]?.status}
                        points={teams.final[index + 1]?.points}
                        typeLine="bottom"
                        groupAlign="left"
                        sx={{ 
                          right: '-32px',
                          top: '227px',
                          height: '207px', // Increased height
                          width: '2px'
                        }}
                        className={`bracket-line-vertical-level-3-team-box-${index + 1}-bottom`}
                      />
                      <BracketLine 
                        isWinner={true}
                        status={teams.final[index]?.status}
                        sx={{ 
                          right: '-64px',
                          top: '226px',
                          width: '32px'
                        }}
                        className={`bracket-line-horizontal-level-6-team-box-${index + 1}`}
                      />
                    </>
                  )}
                </Box>
              ))}
            </Box>

            {/* Finals round 1 - 4 teams */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 45 }}>
              {Array.from({ length: 2 }, (_, i) => i).map((index) => (
                <Box 
                  key={index} 
                  sx={{ 
                    position: 'relative', 
                    mb: index % 2 === 0 ? 98 : 98
                  }}
                >
                  <TeamBox 
                    isWinner={teams.finalRound1[index]?.isWinner} 
                    status={teams.finalRound1[index]?.status}
                    sx={{ width: '180px' }}
                  >
                    {teams.finalRound1[index]?.name || ''}
                  </TeamBox>
                  {index === 0 && (
                    <>
                      <BracketLine 
                        isWinner={true}
                        status={teams.finalRound1[index]?.status}
                        sx={{ 
                          right: '-30px',
                          top: '20px',
                          width: '30px'
                        }}
                        className={`bracket-line-horizontal-level-7-team-box-${index + 1}`}
                      />
                      <BracketLine 
                        isWinner={true}
                        status={teams.finalRound1[index]?.status}
                        sx={{ 
                          right: '-30px',
                          top: '850px',
                          width: '30px'
                        }}
                        className={`bracket-line-horizontal-level-7-team-box-${index + 1}`}
                      />
                      <BracketLine 
                        isWinner={teams.finalRound1[index]?.isWinner}
                        status={teams.finalRound1[index]?.status}
                        points={teams.finalRound1[index]?.points}
                        typeLine="top"
                        groupAlign="left"
                        sx={{ 
                          right: '-30px',
                          top: '20px',
                          height: '415px',
                          width: '2px'
                        }}
                        className={`bracket-line-vertical-level-4-team-box-${index + 1}-top`}
                      />
                      <BracketLine 
                        isWinner={teams.finalRound1[index + 1]?.isWinner}
                        status={teams.finalRound1[index + 1]?.status}
                        points={teams.finalRound1[index + 1]?.points}
                        typeLine="bottom"
                        groupAlign="left"
                        sx={{ 
                          right: '-30px',
                          top: '435px',
                          height: '415px',
                          width: '2px'
                        }}
                        className={`bracket-line-vertical-level-4-team-box-${index + 1}-bottom`}
                      />
                      <BracketLine 
                        isWinner={true}
                        status={teams.finalRound1[index]?.status}
                        sx={{ 
                          right: '-60px',
                          top: '435px',
                          width: '30px'
                        }}
                        className={`bracket-line-horizontal-level-8-team-box-${index + 1}`}
                      />
                    </>
                  )}
                </Box>
              ))}
            </Box>

            {/* Finals round 1 - 2 teams */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 97 }}>
              {Array.from({ length: 1 }, (_, i) => i).map((index) => (
                <Box 
                  key={index} 
                  sx={{ 
                    position: 'relative', 
                    mb: index % 2 === 0 ? 1 : 55
                  }}
                >
                  <TeamBox 
                    isWinner={teams.finalRound2[index]?.isWinner} 
                    status={teams.finalRound2[index]?.status}
                    sx={{ width: '180px' }}
                  >
                    {teams.finalRound2[index]?.name || ''}
                  </TeamBox>
                  {index === 0 && (
                    <>
                      <BracketLine 
                        isWinner={teams.finalRound2[index]?.isWinner}
                        status={teams.finalRound2[index]?.status}
                        points={teams.finalRound2[index]?.points}
                        sx={{ 
                          right: '-96px',
                          top: '20px',
                          width: '96px'
                        }}
                        className={`bracket-line-horizontal-level-9-team-box-${index + 1}`}
                      />
                    </>
                  )}
                </Box>
              ))}
            </Box>
          </Box>

          {/* Champion */}
          <Box sx={{ alignSelf: 'center', mx: 4 }}>
            <TeamBox 
              sx={{ 
                backgroundColor: 'gold !important', 
                position: 'relative', 
                zIndex: 1,
                mt: -29
              }}
            >
              {teams.champion?.name || ''}
            </TeamBox>
          </Box>

          {/* Right Branch - Mirror of Left Branch */}
          <Box sx={{ display: 'flex', gap: 8, flexDirection: 'row-reverse', position: 'relative' }}>
            {/* First Round - 8 matches */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {Array.from({ length: 16 }, (_, i) => i).map((index) => (
                <Box 
                  key={index} 
                  sx={{ 
                    position: 'relative', 
                    mb: index % 2 === 0 ? 4 : 8
                  }}
                >
                  <TeamBox 
                    isWinner={quarterFinalsRight[index]?.isWinner} 
                    status={quarterFinalsRight[index]?.status}
                  >
                    {quarterFinalsRight[index]?.name || ''}
                  </TeamBox>
                  {index % 2 === 0 && (
                    <BracketLine 
                      isWinner={true}
                      status={quarterFinalsRight[index]?.status}
                      sx={{ 
                        left: '-32px',
                        top: '20px',
                        width: '32px'
                      }}
                      className={`bracket-line-horizontal-level-1-team-box-${index + 1}`}
                    />
                  )}
                  {index % 2 === 0 && (
                    <BracketLine 
                      isWinner={true}
                      status={quarterFinalsRight[index]?.status}
                      sx={{ 
                        left: '-32px',
                        top: '104px',
                        width: '32px'
                      }}
                      className={`bracket-line-horizontal-level-1-team-box-${index + 1}`}
                    />
                  )}
                  {index % 2 === 0 && (
                    <BracketLine 
                      isWinner={quarterFinalsRight[index]?.isWinner}
                      status={quarterFinalsRight[index]?.status}
                      points={quarterFinalsRight[index]?.points}
                      typeLine="top"
                      groupAlign="right"
                      sx={{ 
                        left: '-32px',
                        top: '20px',
                        height: '42px',
                        width: '2px'
                      }}
                      className={`bracket-line-vertical-level-1-team-box-${index + 1}-top`}
                    />
                  )}
                  {index % 2 === 0 && (
                    <BracketLine 
                    isWinner={quarterFinalsRight[index + 1]?.isWinner}
                    status={quarterFinalsRight[index + 1]?.status}
                    points={quarterFinalsRight[index + 1]?.points}
                    typeLine="bottom"
                    groupAlign="right"
                      sx={{ 
                        left: '-32px',
                        top: '62px',
                        height: '42px',
                        width: '2px'
                      }}
                      className={`bracket-line-vertical-level-1-team-box-${index + 1}-bottom`}
                    />
                  )}
                  {index % 2 === 0 && (
                    <BracketLine 
                      isWinner={true}
                      status={quarterFinalsRight[index]?.status}
                      sx={{ 
                        left: '-64px',
                        top: '62px',
                        width: '32px'
                      }}
                      className={`bracket-line-horizontal-level-2-team-box-${index + 1}`}
                    />
                  )}
                </Box>
              ))}
            </Box>

            {/* Second Round - 4 matches */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 6 }}>
              {Array.from({ length: 8 }, (_, i) => i).map((index) => (
                <Box 
                  key={index} 
                  sx={{ 
                    position: 'relative', 
                    mb: index % 2 === 0 ? 19 : 19
                  }}
                >
                  <TeamBox 
                    isWinner={teams.semiFinals[index + 8]?.isWinner} 
                    status={teams.semiFinals[index + 8]?.status}
                  >
                    {teams.semiFinals[index + 8]?.name || ''}
                  </TeamBox>
                  {index % 2 === 0 && (
                    <>
                      <BracketLine 
                        isWinner={true}
                        status={teams.semiFinals[index + 8]?.status}
                        sx={{ 
                          left: '-32px',
                          top: '20px',
                          width: '32px'
                        }}
                        className={`bracket-line-horizontal-level-3-team-box-${index + 1}`}
                      />
                      <BracketLine 
                        isWinner={true}
                        status={teams.semiFinals[index + 8]?.status}
                        sx={{ 
                          left: '-32px',
                          top: '228px',
                          width: '32px'
                        }}
                        className={`bracket-line-horizontal-level-3-team-box-${index + 1}`}
                      />
                      <BracketLine 
                        isWinner={teams.semiFinals[index + 8]?.isWinner}
                        status={teams.semiFinals[index + 8]?.status}
                        points={teams.semiFinals[index + 8]?.points}
                        typeLine="top"
                        groupAlign="right"
                        sx={{ 
                          left: '-32px',
                          top: '20px',
                          height: '104px',
                          width: '2px'
                        }}
                        className={`bracket-line-vertical-level-2-team-box-${index + 1}-top`}
                      />
                      <BracketLine 
                        isWinner={teams.semiFinals[index + 8 + 1]?.isWinner}
                        status={teams.semiFinals[index + 8 + 1]?.status}
                        points={teams.semiFinals[index + 8 + 1]?.points}
                        typeLine="bottom"
                        groupAlign="right"
                        sx={{ 
                          left: '-32px',
                          top: '124px',
                          height: '104px',
                          width: '2px'
                        }}
                        className={`bracket-line-vertical-level-2-team-box-${index + 1}-bottom`}
                      />
                      <BracketLine 
                        isWinner={true}
                        status={teams.semiFinals[index + 8]?.status}
                        sx={{ 
                          left: '-64px',
                          top: '124px',
                          width: '32px'
                        }}
                        className={`bracket-line-horizontal-level-4-team-box-${index + 1}`}
                      />
                    </>
                  )}
                </Box>
              ))}
            </Box>

            {/* Quarter Finals - 2 matches */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 19 }}>
              {Array.from({ length: 4 }, (_, i) => i).map((index) => (
                <Box 
                  key={index} 
                  sx={{ 
                    position: 'relative', 
                    mb: index % 2 === 0 ? 45 : 45
                  }}
                >
                  <TeamBox 
                    isWinner={teams.final[index + 4]?.isWinner} 
                    status={teams.final[index + 4]?.status}
                  >
                    {teams.final[index + 4]?.name || ''}
                  </TeamBox>
                  {index % 2 === 0 && (
                    <>
                      <BracketLine 
                        isWinner={true}
                        status={teams.final[index + 4]?.status}
                        sx={{ 
                          left: '-32px',
                          top: '20px',
                          width: '32px'
                        }}
                        className={`bracket-line-horizontal-level-5-team-box-${index + 1}`}
                      />
                      <BracketLine 
                        isWinner={true}
                        status={teams.final[index + 4]?.status}
                        sx={{ 
                          left: '-32px',
                          top: '434px',
                          width: '32px'
                        }}
                        className={`bracket-line-horizontal-level-5-team-box-${index + 1}`}
                      />
                      <BracketLine 
                        isWinner={teams.final[index + 4]?.isWinner}
                        status={teams.final[index + 4]?.status}
                        points={teams.final[index + 4]?.points}
                        typeLine="top"
                        groupAlign="right"
                        sx={{ 
                          left: '-32px',
                          top: '20px',
                          height: '207px',
                          width: '2px'
                        }}
                        className={`bracket-line-vertical-level-3-team-box-${index + 1}-top`}
                      />
                      <BracketLine 
                        isWinner={teams.final[index + 4 + 1]?.isWinner}
                        status={teams.final[index + 4 + 1]?.status}
                        points={teams.final[index + 4 + 1]?.points}
                        typeLine="bottom"
                        groupAlign="right"
                        sx={{ 
                          left: '-32px',
                          top: '227px',
                          height: '207px',
                          width: '2px'
                        }}
                        className={`bracket-line-vertical-level-3-team-box-${index + 1}-bottom`}
                      />
                      <BracketLine 
                        isWinner={true}
                        status={teams.final[index + 4]?.status}
                        sx={{ 
                          left: '-64px',
                          top: '226px',
                          width: '32px'
                        }}
                        className={`bracket-line-horizontal-level-6-team-box-${index + 1}`}
                      />
                    </>
                  )}
                </Box>
              ))}
            </Box>

            {/* Finals round 1 - 4 teams (Right Branch) */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 45 }}>
              {Array.from({ length: 2 }, (_, i) => i).map((index) => (
                <Box 
                  key={index} 
                  sx={{ 
                    position: 'relative', 
                    mb: index % 2 === 0 ? 98 : 98
                  }}
                >
                  <TeamBox 
                    isWinner={teams.finalRound1[index + 2]?.isWinner}
                    status={teams.finalRound1[index + 2]?.status}
                    sx={{ width: '180px' }}
                  >
                    {teams.finalRound1[index + 2]?.name || ''}
                  </TeamBox>
                  {index === 0 && (
                    <>
                      <BracketLine 
                        isWinner={true}
                        status={teams.finalRound1[index + 2]?.status}
                        sx={{ 
                          left: '-30px',
                          top: '20px',
                          width: '30px'
                        }}
                        className={`bracket-line-horizontal-level-7-team-box-${index + 1}-right`}
                      />
                      <BracketLine 
                        isWinner={true}
                        status={teams.finalRound1[index + 2]?.status}
                        sx={{ 
                          left: '-30px',
                          top: '850px',
                          width: '30px'
                        }}
                        className={`bracket-line-horizontal-level-7-team-box-${index + 1}-right`}
                      />
                      <BracketLine 
                        isWinner={teams.finalRound1[index + 2]?.isWinner}
                        status={teams.finalRound1[index + 2]?.status}
                        points={teams.finalRound1[index + 2]?.points}
                        typeLine="top"
                        groupAlign="right"
                        sx={{ 
                          left: '-30px',
                          top: '20px',
                          height: '415px',
                          width: '2px'
                        }}
                        className={`bracket-line-vertical-level-4-team-box-${index + 1}-top-right`}
                      />
                      <BracketLine 
                        isWinner={teams.finalRound1[index + 2 + 1]?.isWinner}
                        status={teams.finalRound1[index + 2 + 1]?.status}
                        points={teams.finalRound1[index + 2 + 1]?.points}
                        typeLine="bottom"
                        groupAlign="right"
                        sx={{ 
                          left: '-30px',
                          top: '435px',
                          height: '415px',
                          width: '2px'
                        }}
                        className={`bracket-line-vertical-level-4-team-box-${index + 1}-bottom-right`}
                      />
                      <BracketLine 
                        isWinner={true}
                        status={teams.finalRound1[index + 2]?.status}
                        sx={{ 
                          left: '-60px',
                          top: '435px',
                          width: '30px'
                        }}
                        className={`bracket-line-horizontal-level-8-team-box-${index + 1}-right`}
                      />
                    </>
                  )}
                </Box>
              ))}
            </Box>

            {/* Finals round 1 - 2 teams */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 97 }}>
              {Array.from({ length: 1 }, (_, i) => i).map((index) => (
                <Box 
                  key={index} 
                  sx={{ 
                    position: 'relative', 
                    mb: index % 2 === 0 ? 1 : 55
                  }}
                >
                  <TeamBox 
                    isWinner={teams.finalRound2[index + 1]?.isWinner} 
                    status={teams.finalRound2[index + 1]?.status}
                    sx={{ width: '180px' }}
                  >
                    {teams.finalRound2[index + 1]?.name || ''}
                  </TeamBox>
                  {index === 0 && (
                    <>
                      <BracketLine 
                        isWinner={teams.finalRound2[index + 1]?.isWinner}
                        status={teams.finalRound2[index + 1]?.status}
                        points={teams.finalRound2[index + 1]?.points}
                        sx={{ 
                          left: '-96px',
                          top: '20px',
                          width: '96px'
                        }}
                        className={`bracket-line-horizontal-level-9-team-box-${index + 1}-right`}
                      />
                    </>
                  )}
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      </Box>

      {/* List of Teams Table */}
      <Box className="list-teams-container" sx={{ mt: 8 }}>
        <Typography variant="h4" sx={{ mb: 4, textAlign: 'center' }}>
          List of Teams
        </Typography>
        <Box className="list-table-teams-box">
          <Tabs
            value={selectedRound}
            onChange={handleRoundChange}
            sx={{ mb: 2 }}
            centered
          >
            <Tab label="Round 1 (32 Teams)" value="round1" />
            <Tab label="Round 2 (16 Teams)" value="round2" />
            <Tab label="Quarter Finals (8 Teams)" value="quarterFinals" />
            <Tab label="Semi Finals (4 Teams)" value="semiFinals" />
            <Tab label="Finals (2 Teams)" value="final" />
            <Tab label="Finals (1 Team)" value="finalRound1" />
            <Tab label="Champion" value="champion" />
          </Tabs>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="teams table">
              <TableHead>
                <TableRow>
                  <TableCell>No.</TableCell>
                  <TableCell>Team Name</TableCell>
                  <TableCell align="right">Points</TableCell>
                  <TableCell align="center">Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {getRoundTeams().map((team, index) => (
                  <TableRow
                    key={index}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {index + 1}
                    </TableCell>
                    <TableCell>{team?.isEmptyTeam ? '' : team?.name}</TableCell>
                    <TableCell align="right">{team?.points}</TableCell>
                    <TableCell align="center">
                      <Box
                        sx={{
                          backgroundColor: selectedRound === 'champion' ? 'gold' : 
                            team.status === 'fighting' ? '#ff9800' :  // Orange color for fighting status
                            team.isWinner ? '#4caf50' : '#f44336',
                          color: 'white',
                          py: 0.5,
                          px: 1,
                          borderRadius: 1,
                          display: 'inline-block'
                        }}
                      >
                        {selectedRound === 'champion' ? 'Champion' : 
                          team.status === 'fighting' ? 'Fighting' :
                          team.isWinner ? 'Winner' : 'Eliminated'}
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>
    </Box>
  );
};

export default CompetePage;
