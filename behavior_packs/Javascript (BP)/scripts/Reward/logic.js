import { ActionFormData, MessageFormData } from "@minecraft/server-ui";
import { RewardPlanByDay } from "./constants.js";
import {
  giveItemToPlayerIfSpace,
  getItemShortNameFromTypeId,
  formatDateAsTextFromDate,
} from "./functions.js";
import {
  loadRewardDataOrEmptyObject,
  saveRewardDataOrReturnFalse,
} from "./database.js";

export function confirmAndClaimReward(
  player,
  currentDayIndexZeroBased,
  dateText,
  mutableAllData,
) {
  const plan = RewardPlanByDay[currentDayIndexZeroBased];

  const confirmForm = new MessageFormData()
    .title("ยืนยันการรับรางวัล")
    .body(
      `วันที่: ${dateText}\n` +
        `ไอเท็ม: ${getItemShortNameFromTypeId(plan.ItemTypeId)}\n` +
        `จำนวน: ${plan.ItemCount}\n` +
        `ต้องการรับตอนนี้หรือไม่?`,
    )
    .button1("ยกเลิก")
    .button2("รับรางวัล");

  confirmForm.show(player).then((result) => {
    if (result.canceled) return;
    if (result.selection !== 1) return;

    try {
      if (giveItemToPlayerIfSpace(player, plan.ItemTypeId, plan.ItemCount)) {
        mutableAllData[player.name] = {
          login: currentDayIndexZeroBased + 1,
          Time: dateText,
        };
        if (saveRewardDataOrReturnFalse(mutableAllData)) {
          player.sendMessage(
            `[/] คุณได้รับ ${plan.ItemCount}x ${getItemShortNameFromTypeId(plan.ItemTypeId)} เมื่อ ${dateText}`,
          );
        } else {
          player.sendMessage("§c[x] ข้อผิดพลาดในการบันทึกข้อมูลการเข้าสู่ระบบ");
        }
      }
    } catch (error) {
      console.warn(`[Reward] Confirm error: ${error}`);
      player.sendMessage("§c[x] เกิดข้อผิดพลาดขณะยืนยันรางวัล");
    }
  });
}

export function showRewardSelectionForm(player) {
  try {
    const now = new Date();
    const todayText = formatDateAsTextFromDate(now);

    const allData = loadRewardDataOrEmptyObject();
    let playerData = allData[player.name] || { login: 0, Time: null };
    let claimedDaysCount = playerData.login;

    const inventory = player.getComponent("minecraft:inventory")?.container;
    if (!inventory) {
      player.sendMessage("§c[x] ไม่พบคลังเก็บของของผู้เล่น");
      return;
    }

    const totalDays = RewardPlanByDay.length;
    if (claimedDaysCount >= totalDays) {
      claimedDaysCount = 0;
      playerData = { login: 0, Time: null };
      allData[player.name] = playerData;
      saveRewardDataOrReturnFalse(allData);
    }

    const form = new ActionFormData()
      .title("Reward")
      .body(
        `Today: ${todayText}\nClaimed: ${claimedDaysCount} Day`,
      );

    for (let i = 0; i < totalDays; i++) {
      const plan = RewardPlanByDay[i];
      const isAlreadyClaimed = i < claimedDaysCount;
      const isCurrentDay = i === claimedDaysCount;

      let buttonText;
      const buttonIconPath = isAlreadyClaimed
        ? "textures/ui/worldsIcon.png"
        : "textures/ui/world_glyph_desaturated.png";

      if (isCurrentDay && inventory.emptySlotsCount < 1) {
        buttonText = `ช่องเก็บของเต็ม!`;
      } else if (isAlreadyClaimed) {
        buttonText = `§7Day ${plan.DayIndexOneBased}: ${getItemShortNameFromTypeId(plan.ItemTypeId)} (รับแล้ว)`;
      } else {
        buttonText = `Day ${plan.DayIndexOneBased}: ${getItemShortNameFromTypeId(plan.ItemTypeId)} (${isCurrentDay ? "พร้อมรับ" : "รอ"})`;
      }

      form.button(buttonText, buttonIconPath);
    }

    form.show(player).then((result) => {
      if (result.canceled) return;

      const selectedIndex = result.selection;

      if (selectedIndex !== claimedDaysCount) {
        player.sendMessage("§c[x] กรุณารับรางวัลตามลำดับวัน!");
        return;
      }

      if (inventory.emptySlotsCount < 1) {
        player.sendMessage(
          "§c[x] ช่องเก็บของเต็ม! กรุณาเคลียร์ช่องเก็บของก่อน",
        );
        return;
      }

      if (playerData.Time === todayText) {
        player.sendMessage(`§7[/] คุณรับรางวัลวันนี้ไปแล้ว (${todayText})`);
        return;
      }

      confirmAndClaimReward(player, claimedDaysCount, todayText, allData);
    });
  } catch (error) {
    console.warn(`[Reward] Show form error: ${error}`);
    player.sendMessage("§c[x] เกิดข้อผิดพลาดขณะแสดง GUI");
  }
}
