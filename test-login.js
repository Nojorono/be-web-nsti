const { execSync } = require('child_process');

try {
  const result = execSync('powershell -Command "try { $body = \'{\\"email\\":\\"admin_it@nikkisuper.co.id\\",\\"password\\":\\"admin123\\"}\'; $result = Invoke-RestMethod -Uri \'http://localhost:3001/user/login\' -Method POST -ContentType \'application/json\' -Body $body; Write-Host \\"Login successful: $($result | ConvertTo-Json)\\"; } catch { Write-Host \\"Login failed: $($_.Exception.Message)\\" }"', { encoding: 'utf8' });
  console.log(result);
} catch (error) {
  console.error('Error:', error.stdout || error.message);
}
